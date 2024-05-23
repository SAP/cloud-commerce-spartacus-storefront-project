/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule, Type } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { QuoteModule } from '@spartacus/quote';
import { CpqDiscountModule } from '@spartacus/cpq-quote';
// import { CpqQuoteModule } from '@spartacus/cpq-quote';

const extensions: Type<any>[] = [];
if (environment.cpq) {
  extensions.push(CpqDiscountModule);
}
@NgModule({
  imports: [QuoteModule, ...extensions],
})
export class QuoteWrapperModule {}
