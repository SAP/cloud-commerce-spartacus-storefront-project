/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import {
  OpfCartAdapter,
  OpfOrderAdapter,
  OpfPaymentAdapter,
} from '@spartacus/opf/base/core';
import { OccOrderNormalizer } from '@spartacus/order/occ';
import { ORDER_NORMALIZER } from '@spartacus/order/root';
import { OccOpfCartAdapter, OccOpfOrderAdapter } from './adapters';
import { OccOpfPaymentAdapter } from './adapters/occ-opf.adapter';
import { defaultOccOpfCartConfig } from './config/default-occ-opf-cart-config';
import { defaultOccOpfConfig } from './config/default-occ-opf-config';
import { defaultOccOpfOrderConfig } from './config/default-occ-opf-order-config';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideDefaultConfig(defaultOccOpfConfig),
    {
      provide: OpfPaymentAdapter,
      useClass: OccOpfPaymentAdapter,
    },
    provideDefaultConfig(defaultOccOpfOrderConfig),
    {
      provide: OpfOrderAdapter,
      useClass: OccOpfOrderAdapter,
    },
    {
      provide: ORDER_NORMALIZER,
      useExisting: OccOrderNormalizer,
      multi: true,
    },
    provideDefaultConfig(defaultOccOpfCartConfig),
    {
      provide: OpfCartAdapter,
      useClass: OccOpfCartAdapter,
    },
  ],
})
export class OpfBaseOccModule {}
