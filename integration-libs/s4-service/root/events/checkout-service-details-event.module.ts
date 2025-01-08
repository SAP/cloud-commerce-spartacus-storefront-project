/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CheckoutServiceDetailsEventListener } from './checkout-service-details-event.listener';

@NgModule({})
export class CheckoutServiceDetailsEventModule {
  constructor(
    _checkoutServiceDetailsEventListener: CheckoutServiceDetailsEventListener
  ) {
    // Intentional empty constructor
  }
}
