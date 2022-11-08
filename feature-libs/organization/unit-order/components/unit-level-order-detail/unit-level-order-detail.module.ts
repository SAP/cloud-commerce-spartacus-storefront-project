/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { UnitLevelOrdersViewerGuard } from '../../core/guards';
import {
  UnitLevelOrderOverviewComponent,
  UnitLevelOrderOverviewModule,
} from './unit-level-order-overview';
import {
  OrderDetailItemsComponent,
  OrderDetailsService,
  OrderDetailTotalsComponent,
} from '@spartacus/order/components';
import { UnitLevelOrderDetailService } from './unit-level-order-detail.service';

@NgModule({
  imports: [CommonModule, UnitLevelOrderOverviewModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        UnitLevelOrderDetailsOverviewComponent: {
          component: UnitLevelOrderOverviewComponent,
          guards: [AuthGuard, UnitLevelOrdersViewerGuard],
        },
        UnitLevelOrderDetailsItemsComponent: {
          component: OrderDetailItemsComponent,
          guards: [AuthGuard, UnitLevelOrdersViewerGuard],
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: UnitLevelOrderDetailService,
            },
          ],
        },
        UnitLevelOrderDetailsTotalsComponent: {
          component: OrderDetailTotalsComponent,
          guards: [AuthGuard, UnitLevelOrdersViewerGuard],
          providers: [
            {
              provide: OrderDetailsService,
              useExisting: UnitLevelOrderDetailService,
            },
          ],
        },
      },
    }),
  ],
})
export class UnitLevelOrderDetailModule {}
