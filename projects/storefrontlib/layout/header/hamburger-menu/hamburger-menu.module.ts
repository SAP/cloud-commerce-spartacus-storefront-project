/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@commerce-storefront-toolset/core';
import { HamburgerMenuComponent } from './hamburger-menu.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        HamburgerMenuComponent: {
          component: HamburgerMenuComponent,
        },
      },
    }),
  ],
  declarations: [HamburgerMenuComponent],
  exports: [HamburgerMenuComponent],
})
export class HamburgerMenuModule {}
