import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserOrderAdapter } from './user-order.adapter';
import { Order, OrderHistoryList } from '../../../model/order.model';
import { ANONYMOUS_USERID } from '../../../cart/facade/cart-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserOrderConnector {
  constructor(protected adapter: UserOrderAdapter) {}

  public get(userId: string, orderCode: string): Observable<Order> {
    if (userId === ANONYMOUS_USERID) {
      return this.adapter.loadByCode(orderCode);
    }
    return this.adapter.load(userId, orderCode);
  }

  public getHistory(
    userId: string,
    pageSize?: number,
    currentPage?: number,
    sort?: string
  ): Observable<OrderHistoryList> {
    return this.adapter.loadHistory(userId, pageSize, currentPage, sort);
  }
}
