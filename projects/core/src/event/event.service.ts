import { AbstractType, Injectable, isDevMode } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CxEvent } from './cx-event';
import { MergingSubject } from './utils/merging-subject';

/**
 * The object holds registered source observables as well as the merged result observable.
 */
interface EventMeta<T> {
  /**
   * Input subject used for dispatching occasional event (without registering a source)
   */
  inputSubject$: Subject<T>;

  /**
   * A custom subject that allows for dynamic adding and removing sources to be merged as an output
   */
  mergingSubject: MergingSubject<T>;
}

/**
 * A service to register and observe event sources. Events are driven by event types, which are class signatures
 * for the given event.
 *
 * It is possible to register multiple sources to a single event, even without
 * knowing as multiple decoupled features can attach sources to the same
 * event type.
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  /**
   * The various events meta are collected in a map, stored by the event type class
   */
  private eventsMeta = new Map<AbstractType<any> | any, EventMeta<any>>();

  /**
   * Register an event source for the given event type.
   *
   * CAUTION: To avoid memory leaks, the returned teardown function should be called
   *  when the event source is no longer maintained by its creator
   * (i.e. in `ngOnDestroy` if the event source was registered in the component).
   *
   * @param eventType the event type
   * @param source$ an observable that represents the source
   *
   * @returns a teardown function which unregisters the given event source
   */
  register<T>(eventType: AbstractType<T>, source$: Observable<T>): () => void {
    const mergingSubjects: MergingSubject<T>[] = [];
    let parentType = eventType;
    while (
      parentType !== null &&
      Object.getPrototypeOf(parentType) !== Object.getPrototypeOf({})
    ) {
      const eventMeta = this.getEventMeta(parentType);
      if (eventMeta.mergingSubject.has(source$)) {
        if (isDevMode()) {
          console.warn(
            `EventService: the event source`,
            source$,
            `has been already registered for the type`,
            parentType
          );
        }
      } else {
        eventMeta.mergingSubject.add(source$);
      }

      parentType = Object.getPrototypeOf(parentType);

      // TODO: check for the CxEvent?
    }

    return () =>
      mergingSubjects.forEach((mergingSubject) =>
        mergingSubject.remove(source$)
      );
  }

  /**
   * Returns a stream of events for the given event type
   * @param eventTypes event type
   */
  get<T>(eventType: AbstractType<T>): Observable<T> {
    let output$ = this.getEventMeta(eventType).mergingSubject.output$;
    if (isDevMode()) {
      output$ = this.getValidatedEventStream(output$, eventType);
    }
    return output$;
  }

  /**
   * Dispatches an instance of an individual event.
   */
  dispatch(event: Object): void {
    const eventType = event.constructor as AbstractType<any>;
    const inputSubject$ = this.getInputSubject(eventType);
    inputSubject$.next(event);
  }

  /**
   * Returns the input subject used to dispatch a single event.
   * The subject is created on demand, when it's needed for the first time.
   * @param eventType type of event
   */
  private getInputSubject<T>(eventType: AbstractType<T>): Subject<T> {
    const eventMeta = this.getEventMeta(eventType);

    if (!eventMeta.inputSubject$) {
      eventMeta.inputSubject$ = new Subject<any>();
      this.register(eventType, eventMeta.inputSubject$);
    }
    return eventMeta.inputSubject$;
  }

  /**
   * Returns the event meta object for the given event type
   */
  private getEventMeta<T>(eventType: AbstractType<T>): EventMeta<T> {
    if (isDevMode()) {
      this.validateEventType(eventType);
    }

    if (!this.eventsMeta.get(eventType)) {
      this.createEventMeta(eventType);
    }
    return this.eventsMeta.get(eventType);
  }

  /**
   * Creates the event meta object for the given event type
   */
  private createEventMeta<T>(eventType: AbstractType<T>): void {
    let parentType = eventType;
    while (
      parentType !== null &&
      Object.getPrototypeOf(parentType) !== Object.getPrototypeOf({})
    ) {
      this.eventsMeta.set(parentType, {
        inputSubject$: null, // will be created lazily by the `dispatch` method
        mergingSubject: new MergingSubject(),
      });

      parentType = Object.getPrototypeOf(parentType);

      console.log('parentType: ', parentType);
      console.log(
        'parentType instanceof CxEvent: ',
        parentType instanceof CxEvent
      );
      console.log(
        'parentType.constructor.type: ',
        (parentType.constructor as any).type
      );

      // stop as soon as the first parent is already registered
      if (this.eventsMeta.has(parentType)) {
        break;
      }
    }
  }

  /**
   * Checks if the event type is a valid type (is a class with constructor).
   *
   * Should be used only in dev mode.
   */
  private validateEventType<T>(eventType: AbstractType<T>): void {
    if (!eventType?.constructor) {
      throw new Error(
        `EventService:  ${eventType} is not a valid event type. Please provide a class reference.`
      );
    }
  }

  /**
   * Returns the given event source with runtime validation whether the emitted values are instances of given event type.
   *
   * Should be used only in dev mode.
   */
  private getValidatedEventStream<T>(
    source$: Observable<T>,
    eventType: AbstractType<T>
  ): Observable<T> {
    return source$.pipe(
      tap((event) => {
        if (!(event instanceof eventType)) {
          console.warn(
            `EventService: The stream`,
            source$,
            `emitted the event`,
            event,
            `that is not an instance of the declared type`,
            eventType.name
          );
        }
      })
    );
  }
}
