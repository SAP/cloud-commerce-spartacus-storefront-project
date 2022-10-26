/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { AsmCustomerOverviewComponent } from './asm-customer-overview.component';
import { AsmProductItemComponent } from './asm-product-item/asm-product-item.component';

@NgModule({
  imports: [CommonModule, MediaModule, RouterModule, UrlModule, I18nModule],
  declarations: [AsmCustomerOverviewComponent, AsmProductItemComponent],
  exports: [AsmCustomerOverviewComponent],
})
export class AsmCustomerOverviewModule {}
