/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  UrlModule,
} from '@commerce-storefront-toolset/core';
import { ListNavigationModule } from '@commerce-storefront-toolset/storefront';
import { ApproverGuard } from '../../core/guards/approver.guard';
import { OrderApprovalListComponent } from './order-approval-list.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        OrderApprovalListComponent: {
          component: OrderApprovalListComponent,
          guards: [AuthGuard, ApproverGuard],
        },
      },
    }),
    UrlModule,
    RouterModule,
    ListNavigationModule,
    I18nModule,
    FeaturesConfigModule,
  ],
  declarations: [OrderApprovalListComponent],
  exports: [OrderApprovalListComponent],
})
export class OrderApprovalListModule {}
