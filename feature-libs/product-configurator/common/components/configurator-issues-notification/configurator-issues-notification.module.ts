/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { I18nModule, UrlModule } from '@spartacus/core';
import { IconModule, provideOutlet } from '@spartacus/storefront';
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
      id: CartOutlets.ITEM_CONFIGURATOR_ISSUES,
      component: ConfiguratorIssuesNotificationComponent,
    }),
  ],
  exports: [ConfiguratorIssuesNotificationComponent],
})
export class ConfiguratorIssuesNotificationModule {}
