import { Injectable } from '@angular/core';
import {
    GetOrderEntriesContext,
    OrderEntriesSource,
    OrderEntry
} from '@spartacus/cart/base/root';
import { Order, OrderFacade } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsOrderEntriesContext implements GetOrderEntriesContext {
  readonly type = OrderEntriesSource.ORDER_DETAILS;

  constructor(protected userOrderService: OrderFacade) {}

  getEntries(): Observable<OrderEntry[]> {
    return this.userOrderService
      .getOrderDetails()
      .pipe(map((order: Order) => order?.entries ?? []));
  }
}
