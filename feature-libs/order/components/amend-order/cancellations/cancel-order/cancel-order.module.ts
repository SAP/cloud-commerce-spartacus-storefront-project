/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import {
  FormErrorsModule,
  MessageComponentModule,
} from '@spartacus/storefront';
import { AmendOrderActionsModule } from '../../amend-order-actions/amend-order-actions.module';
import { AmendOrderItemsModule } from '../../amend-order-items/amend-order-items.module';
import { OrderAmendService } from '../../amend-order.service';
import { OrderCancellationService } from '../order-cancellation.service';
import { CancelOrderComponent } from './cancel-order.component';

@NgModule({
    imports: [
        CommonModule,
        I18nModule,
        AmendOrderItemsModule,
        AmendOrderActionsModule,
        FormErrorsModule,
        MessageComponentModule,
        FeaturesConfigModule,
        CancelOrderComponent,
    ],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                CancelOrderComponent: {
                    component: CancelOrderComponent,
                    guards: [AuthGuard],
                    providers: [
                        {
                            provide: OrderAmendService,
                            useExisting: OrderCancellationService,
                        },
                    ],
                },
            },
        }),
    ],
    exports: [CancelOrderComponent],
})
export class CancelOrderModule {}
