import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';
import { RoutingService } from '../../../routing/index';
import { makeHttpErrorSerializable } from '../../../util/serialization-utils';
import { CmsComponentConnector } from '../../connectors/component/cms-component.connector';
import * as componentActions from '../actions/component.action';

@Injectable()
export class ComponentEffects {
  constructor(
    private actions$: Actions,
    private cmsComponentLoader: CmsComponentConnector,
    private routingService: RoutingService
  ) {}

  @Effect()
  loadComponent$: Observable<Action> = this.actions$.pipe(
    ofType(componentActions.LOAD_COMPONENT),
    map((action: componentActions.LoadComponent) => action.payload),
    groupBy(uid => uid),
    mergeMap(group =>
      group.pipe(
        switchMap(uid =>
          this.routingService.getRouterState().pipe(
            filter(routerState => routerState !== undefined),
            map(routerState => routerState.state.context),
            take(1),
            mergeMap(pageContext =>
              this.cmsComponentLoader.get(uid, pageContext).pipe(
                map(
                  data => new componentActions.LoadComponentSuccess(data, uid)
                ),
                catchError(error =>
                  of(
                    new componentActions.LoadComponentFail(
                      uid,
                      makeHttpErrorSerializable(error)
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
