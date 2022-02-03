import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartActions } from '@spartacus/cart/base/core';
import { normalizeHttpError } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { CheckoutReplenishmentOrderConnector } from '../../connectors/index';
import { CheckoutActions } from '../actions/index';

@Injectable()
export class ReplenishmentOrderEffects {
  scheduleReplenishmentOrder$: Observable<
    | CheckoutActions.ScheduleReplenishmentOrderSuccess
    | CheckoutActions.ScheduleReplenishmentOrderFail
    | CartActions.RemoveCart
  > = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.SCHEDULE_REPLENISHMENT_ORDER),
      map(
        (action: CheckoutActions.ScheduleReplenishmentOrder) => action.payload
      ),
      mergeMap((payload) => {
        return this.checkoutReplOrderConnector
          .scheduleReplenishmentOrder(
            payload.cartId,
            payload.scheduleReplenishmentForm,
            payload.termsChecked,
            payload.userId
          )
          .pipe(
            switchMap((data) => [
              new CartActions.RemoveCart({ cartId: payload.cartId }),
              new CheckoutActions.ScheduleReplenishmentOrderSuccess(data),
            ]),
            catchError((error) =>
              of(
                new CheckoutActions.ScheduleReplenishmentOrderFail(
                  normalizeHttpError(error)
                )
              )
            )
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private checkoutReplOrderConnector: CheckoutReplenishmentOrderConnector
  ) {}
}
