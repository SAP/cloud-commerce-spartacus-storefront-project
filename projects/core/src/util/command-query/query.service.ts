import { Injectable, OnDestroy, Type } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  iif,
  isObservable,
  merge,
  Observable,
  of,
  Subscription,
  using,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  pluck,
  share,
  switchMapTo,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { EventService } from '../../event/event.service';
import { CxEvent } from '../../event/cx-event';

export type QueryNotifier = Observable<any> | Type<CxEvent>;

export interface QueryState<T> {
  loading: boolean;
  error: false | Error;
  data: T | undefined;
}

export interface Query<T, P extends any[] = []> {
  get(...params: P): Observable<T | undefined>;
  getState(...params: P): Observable<QueryState<T>>;
}

@Injectable({
  providedIn: 'root',
})
export class QueryService implements OnDestroy {
  protected subscriptions = new Subscription();

  constructor(protected eventService: EventService) {}

  create<T>(
    loaderFactory: () => Observable<T>,
    options?: {
      reloadOn?: QueryNotifier[];
      resetOn?: QueryNotifier[];
    }
  ): Query<T> {
    const state$ = new BehaviorSubject<QueryState<T>>({
      data: undefined,
      error: false,
      loading: false,
    });

    // if query will be unsubscribed when data is loaded, we will end up with loading flag set to true
    // we want to retry this load on next subscription
    const retryInterruptedLoad$ = iif(
      () => state$.value.loading,
      of(undefined)
    );

    const loadTrigger$ = this.getTriggersStream([
      state$.pipe(
        filter(
          ({ data, loading, error }) => data === undefined && !loading && !error
        )
      ),
      ...(options?.reloadOn ?? []),
      retryInterruptedLoad$,
    ]);

    const resetTrigger$ = this.getTriggersStream(options?.resetOn ?? []);

    const load$ = loadTrigger$.pipe(
      tap(() => state$.next({ ...state$.value, loading: true })),
      switchMapTo(loaderFactory().pipe(takeUntil(resetTrigger$))),
      tap((data) => {
        state$.next({ loading: false, error: false, data });
      }),
      catchError((error) => {
        state$.next({ loading: false, error, data: undefined });
        return EMPTY;
      }),
      share()
    );

    // reset logic
    if (options?.resetOn?.length) {
      this.subscriptions.add(
        resetTrigger$.subscribe(() => {
          if (
            state$.value.data !== undefined ||
            state$.value.error !== false ||
            state$.value.loading !== false
          ) {
            state$.next({
              data: undefined,
              error: false,
              loading: false,
            });
          }
        })
      );
    }

    const query$ = using(
      () => load$.subscribe(),
      () => state$
    );

    const data$ = query$.pipe(pluck('data'), distinctUntilChanged());

    return { get: () => data$, getState: () => query$ };
  }

  protected getTriggersStream(triggers: QueryNotifier[]): Observable<any> {
    if (!triggers.length) {
      return EMPTY;
    }
    const observables = triggers.map((trigger) => {
      if (isObservable(trigger)) {
        return trigger;
      }
      return this.eventService.get(trigger);
    });
    return merge(...observables);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
