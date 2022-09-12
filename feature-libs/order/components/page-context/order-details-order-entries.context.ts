/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import {
  GetOrderEntriesContext,
  OrderEntriesSource,
  OrderEntry,
} from '@commerce-storefront-toolset/cart/base/root';
import { Order, OrderHistoryFacade } from '@commerce-storefront-toolset/order/root';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsOrderEntriesContext implements GetOrderEntriesContext {
  readonly type = OrderEntriesSource.ORDER_DETAILS;

  constructor(protected orderHistoryFacade: OrderHistoryFacade) {}

  getEntries(): Observable<OrderEntry[]> {
    return this.orderHistoryFacade
      .getOrderDetails()
      .pipe(map((order: Order) => order?.entries ?? []));
  }
}
