/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import {
  ReplenishmentOrder,
  ScheduleReplenishmentForm,
} from '@commerce-storefront-toolset/order/root';
import { Observable } from 'rxjs';
import { ScheduledReplenishmentOrderAdapter } from './scheduled-replenishment-order.adapter';

@Injectable()
export class ScheduledReplenishmentOrderConnector {
  constructor(protected adapter: ScheduledReplenishmentOrderAdapter) {}

  public scheduleReplenishmentOrder(
    cartId: string,
    scheduleReplenishmentForm: ScheduleReplenishmentForm,
    termsChecked: boolean,
    userId: string
  ): Observable<ReplenishmentOrder> {
    return this.adapter.scheduleReplenishmentOrder(
      cartId,
      scheduleReplenishmentForm,
      termsChecked,
      userId
    );
  }
}
