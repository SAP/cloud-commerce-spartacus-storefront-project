/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UrlModule, I18nModule } from '@commerce-storefront-toolset/core';
import { ProductVariantSizeSelectorComponent } from './product-variant-size-selector.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, UrlModule, I18nModule],
  declarations: [ProductVariantSizeSelectorComponent],
  exports: [ProductVariantSizeSelectorComponent],
})
export class ProductVariantSizeSelectorModule {}
