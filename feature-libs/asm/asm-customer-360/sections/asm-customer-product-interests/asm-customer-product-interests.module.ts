/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';

import { AsmCustomerProductListingModule } from '../../asm-customer-ui-components/asm-customer-product-listing/asm-customer-product-listing.module';
import { AsmCustomerProductInterestsComponent } from './asm-customer-product-interests.component';

@NgModule({
  imports: [CommonModule, I18nModule, AsmCustomerProductListingModule],
  declarations: [AsmCustomerProductInterestsComponent],
  exports: [AsmCustomerProductInterestsComponent],
})
export class AsmCustomerProductInterestsModule {}
