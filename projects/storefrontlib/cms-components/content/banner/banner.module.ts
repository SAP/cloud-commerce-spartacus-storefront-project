/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  provideDefaultConfig } from '@spartacus/core';
import { GenericLinkModule } from '../../../shared/components/generic-link/generic-link.module';
import { MediaModule } from '../../../shared/components/media/media.module';
import { BannerComponent } from './banner.component';

@NgModule({
  imports: [CommonModule, RouterModule, GenericLinkModule, MediaModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        SimpleResponsiveBannerComponent: {
          component: BannerComponent,
        },
        BannerComponent: {
          component: BannerComponent,
        },
        SimpleBannerComponent: {
          component: BannerComponent,
        },
      },
    }),
  ],
  declarations: [BannerComponent],
  exports: [BannerComponent],
})
export class BannerModule {}
