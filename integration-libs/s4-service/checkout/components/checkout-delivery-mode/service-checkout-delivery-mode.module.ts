/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import {
  OutletModule,
  PageComponentModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { ServiceCheckoutDeliveryModeComponent } from './service-checkout-delivery-mode.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    SpinnerModule,
    OutletModule,
    PageComponentModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutDeliveryMode: {
          component: ServiceCheckoutDeliveryModeComponent,
        },
      },
    }),
  ],
  declarations: [ServiceCheckoutDeliveryModeComponent],
  exports: [ServiceCheckoutDeliveryModeComponent],
})
export class ServiceCheckoutDeliveryModeModule {}
