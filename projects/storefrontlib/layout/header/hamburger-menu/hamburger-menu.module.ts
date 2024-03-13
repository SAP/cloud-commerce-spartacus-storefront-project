/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {  I18nModule, provideDefaultConfig } from '@spartacus/core';
import { HamburgerMenuComponent } from './hamburger-menu.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  providers: [
    provideDefaultConfig({
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
