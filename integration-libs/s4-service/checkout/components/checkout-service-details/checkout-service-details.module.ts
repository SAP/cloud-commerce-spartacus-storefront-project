/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CartNotEmptyGuard,
  CheckoutAuthGuard,
} from '@spartacus/checkout/base/components';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { CheckoutServiceDetailsComponent } from './checkout-service-details.component';
import { DatePickerModule } from '@spartacus/storefront';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, I18nModule, DatePickerModule, ReactiveFormsModule, CheckoutServiceDetailsComponent],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                CheckoutServiceDetails: {
                    component: CheckoutServiceDetailsComponent,
                    guards: [CheckoutAuthGuard, CartNotEmptyGuard],
                },
            },
        }),
    ],
    exports: [CheckoutServiceDetailsComponent],
})
export class CheckoutServiceDetailsModule {}
