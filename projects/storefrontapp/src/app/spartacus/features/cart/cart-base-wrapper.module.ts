/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule, Type } from '@angular/core';

import { CartBaseModule } from '@spartacus/cart/base';
import { CpqQuoteModule } from '@spartacus/cpq-quote';
import { EstimatedDeliveryDateModule } from '@spartacus/estimated-delivery-date';
import { environment } from '../../../../environments/environment';

const extensions: Type<any>[] = [];

if (environment.estimatedDeliveryDate) {
  extensions.push(EstimatedDeliveryDateModule);
}
if (environment.cpq) {
  extensions.push(CpqQuoteModule);
}
@NgModule({
  imports: [CartBaseModule, ...extensions],
})
export class CartBaseWrapperModule {}
