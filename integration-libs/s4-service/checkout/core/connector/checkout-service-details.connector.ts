/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { ServiceDetails } from '@spartacus/s4-service/root';
import { Observable } from 'rxjs';
import { CheckoutServiceDetailsAdapter } from './checkout-service-details.adapter';

@Injectable()
export class CheckoutServiceDetailsConnector {
  protected adapter = inject(CheckoutServiceDetailsAdapter);
  setServiceScheduleSlot(
    userId: string,
    cartId: string,
    scheduledAt: ServiceDetails
  ): Observable<unknown> {
    return this.adapter.setServiceScheduleSlot(userId, cartId, scheduledAt);
  }
}
