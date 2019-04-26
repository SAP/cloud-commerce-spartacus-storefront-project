import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromOrderDetailsAction from '../actions/order-details.action';
import { OccOrderService } from '../../occ/index';
import { Order } from '../../../occ/occ-models/index';
import { ConverterService } from '../../../util/converter.service';
import { PRODUCT_NORMALIZER } from '../../../product/connectors/product/converters';

@Injectable()
export class OrderDetailsEffect {
  @Effect()
  loadOrderDetails$: Observable<
    fromOrderDetailsAction.OrderDetailsAction
  > = this.actions$.pipe(
    ofType(fromOrderDetailsAction.LOAD_ORDER_DETAILS),
    map((action: fromOrderDetailsAction.LoadOrderDetails) => action.payload),
    switchMap(payload => {
      return this.occOrderService
        .getOrder(payload.userId, payload.orderCode)
        .pipe(
          map((order: Order) => {
            if (order.consignments) {
              order.consignments.forEach(element => {
                element.entries.forEach(entry => {
                  entry.orderEntry.product = this.converter.convert(
                    entry.orderEntry.product,
                    PRODUCT_NORMALIZER
                  ) as any;
                });
              });
            }
            if (order.unconsignedEntries) {
              order.unconsignedEntries.forEach(entry => {
                entry.product = this.converter.convert(
                  entry.product,
                  PRODUCT_NORMALIZER
                ) as any;
              });
            }
            return new fromOrderDetailsAction.LoadOrderDetailsSuccess(order);
          }),
          catchError(error =>
            of(new fromOrderDetailsAction.LoadOrderDetailsFail(error))
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private occOrderService: OccOrderService,
    private converter: ConverterService
  ) {}
}
