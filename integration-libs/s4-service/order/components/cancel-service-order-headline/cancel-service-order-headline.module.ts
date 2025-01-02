/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  UrlModule,
  provideDefaultConfig,
} from '@spartacus/core';
import {
  CardModule,
  IconModule,
  OutletModule,
  PromotionsModule,
} from '@spartacus/storefront';
import { CancelServiceOrderHeadlineComponent } from './cancel-service-order-headline.component';

@NgModule({
  declarations: [CancelServiceOrderHeadlineComponent],
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    CardModule,
    UrlModule,
    PromotionsModule,
    IconModule,
    OutletModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CancelServiceOrderHeadline: {
          component: CancelServiceOrderHeadlineComponent,
          guards: [AuthGuard],
        },
      },
    }),
  ],
  exports: [CancelServiceOrderHeadlineComponent],
})
export class CancelServiceOrderHeadlineModule {}
