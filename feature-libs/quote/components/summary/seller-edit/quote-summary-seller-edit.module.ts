/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { DatePickerModule, IconModule } from '@spartacus/storefront';
import { QuoteSummarySellerEditComponent } from './quote-summary-seller-edit.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    DatePickerModule,
  ],
  declarations: [QuoteSummarySellerEditComponent],
  exports: [QuoteSummarySellerEditComponent],
})
export class QuoteSummarySellerEditModule {}
