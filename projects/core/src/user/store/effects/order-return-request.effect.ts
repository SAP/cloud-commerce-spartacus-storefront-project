import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ReturnRequest } from '../../../model/order.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { UserOrderConnector } from '../../connectors/order/user-order.connector';
import { UserActions } from '../actions/index';

@Injectable()
export class OrderReturnRequestEffect {
  @Effect()
  createReturnRequest$: Observable<
    UserActions.OrderReturnRequestAction
  > = this.actions$.pipe(
    ofType(UserActions.CREATE_ORDER_RETURN_REQUEST),
    map((action: UserActions.CreateOrderReturnRequest) => action.payload),
    switchMap(payload => {
      return this.orderConnector
        .return(payload.userId, payload.returnRequestInput)
        .pipe(
          map((returnRequest: ReturnRequest) => {
            return new UserActions.CreateOrderReturnRequestSuccess(
              returnRequest
            );
          }),
          catchError(error =>
            of(
              new UserActions.CreateOrderReturnRequestFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private orderConnector: UserOrderConnector
  ) {}
}
