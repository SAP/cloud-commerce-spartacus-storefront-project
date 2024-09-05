/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard, CmsConfig, provideDefaultConfig } from '@spartacus/core';


import { OrderAmendService } from '../../amend-order.service';
import { OrderCancellationGuard } from '../order-cancellation.guard';
import { OrderCancellationService } from '../order-cancellation.service';
import { CancelOrderConfirmationComponent } from './cancel-order-confirmation.component';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    CancelOrderConfirmationComponent,
],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                CancelOrderConfirmationComponent: {
                    component: CancelOrderConfirmationComponent,
                    guards: [AuthGuard, OrderCancellationGuard],
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
    exports: [CancelOrderConfirmationComponent],
})
export class CancelOrderConfirmationModule {}
