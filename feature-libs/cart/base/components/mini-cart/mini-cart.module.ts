/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { MiniCartComponent } from './mini-cart.component';

@NgModule({
    imports: [CommonModule, RouterModule, UrlModule, IconModule, I18nModule, MiniCartComponent],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                MiniCartComponent: {
                    component: MiniCartComponent,
                },
            },
        }),
    ],
    exports: [MiniCartComponent],
})
export class MiniCartModule {}
