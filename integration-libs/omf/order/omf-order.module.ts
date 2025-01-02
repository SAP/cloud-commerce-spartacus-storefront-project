/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { OrderHistoryAdapter } from '@spartacus/order/core';
import { OrderHistoryFacade } from '@spartacus/order/root';
import { defaultOmfConfig } from './config/default-omf-config';
import { OccOmfOrderHistoryAdapter } from './occ-omf-order-history.adapter';
import { OmfOrderHistoryService } from './omf-order-history.service';

@NgModule({
  providers: [
    OmfOrderHistoryService,
    provideDefaultConfig(defaultOmfConfig),
    { provide: OrderHistoryAdapter, useClass: OccOmfOrderHistoryAdapter },
    {
      provide: OrderHistoryFacade,
      useClass: OmfOrderHistoryService,
    },
  ],
})
export class OmfOrderModule {}
