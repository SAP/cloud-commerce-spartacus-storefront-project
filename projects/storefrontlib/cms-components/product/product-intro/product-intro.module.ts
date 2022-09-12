/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@commerce-storefront-toolset/core';
import { StarRatingModule } from '../../../shared/components/star-rating/star-rating.module';
import { ProductIntroComponent } from './product-intro.component';

@NgModule({
  imports: [CommonModule, I18nModule, StarRatingModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ProductIntroComponent: {
          component: ProductIntroComponent,
        },
      },
    }),
  ],
  declarations: [ProductIntroComponent],
  exports: [ProductIntroComponent],
})
export class ProductIntroModule {}
