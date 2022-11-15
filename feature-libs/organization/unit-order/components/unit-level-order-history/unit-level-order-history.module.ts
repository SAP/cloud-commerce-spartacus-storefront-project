/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { ListNavigationModule } from '@spartacus/storefront';
import { UnitLevelOrdersViewerGuard } from '../../core/guards';
import { UnitLevelOrderHistoryComponent } from './unit-level-order-history.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
  ],
  declarations: [UnitLevelOrderHistoryComponent],
  exports: [UnitLevelOrderHistoryComponent],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        UnitLevelOrderHistoryComponent: {
          component: UnitLevelOrderHistoryComponent,
          guards: [AuthGuard, UnitLevelOrdersViewerGuard],
        },
      },
    }),
  ],
})
export class UnitLevelOrderHistoryModule {}
