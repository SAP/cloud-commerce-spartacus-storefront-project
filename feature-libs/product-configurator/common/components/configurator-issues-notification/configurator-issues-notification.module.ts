/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  IconModule,
  OutletPosition,
  provideOutlet,
} from '@spartacus/storefront';
import { ConfigureCartEntryModule } from '../configure-cart-entry/configure-cart-entry.module';
import { ConfiguratorIssuesNotificationRowComponent } from './configurator-issues-notification-row.component';
import { ConfiguratorIssuesNotificationComponent } from './configurator-issues-notification.component';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    IconModule,
    ConfigureCartEntryModule,
  ],
  declarations: [
    ConfiguratorIssuesNotificationComponent,
    ConfiguratorIssuesNotificationRowComponent,
  ],
  providers: [
    provideOutlet({
      id: CartOutlets.LIST_ITEM,
      position: OutletPosition.BEFORE,
      component: ConfiguratorIssuesNotificationComponent,
    }),

    // USING THE SAME COMPONENT FOR BOTH OUTLETS
    provideOutlet({
      id: CartOutlets.ITEM,
      position: OutletPosition.BEFORE,
      component: ConfiguratorIssuesNotificationComponent,
    }),
  ],
  exports: [ConfiguratorIssuesNotificationComponent],
})
export class ConfiguratorIssuesNotificationModule {}
