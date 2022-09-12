/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@commerce-storefront-toolset/core';
import { IconModule, KeyboardFocusModule } from '@commerce-storefront-toolset/storefront';
import { ConfiguratorGroupMenuComponent } from './configurator-group-menu.component';

@NgModule({
  imports: [CommonModule, I18nModule, IconModule, KeyboardFocusModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ConfiguratorMenu: {
          component: ConfiguratorGroupMenuComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorGroupMenuComponent],
  exports: [ConfiguratorGroupMenuComponent],
})
export class ConfiguratorGroupMenuModule {}
