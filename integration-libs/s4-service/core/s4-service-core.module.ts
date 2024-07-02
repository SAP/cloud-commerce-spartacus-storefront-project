/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';

import {
  CheckoutServiceDetailsService,
  CheckoutServiceSchedulePickerService,
} from './facade';
import { CheckoutServiceDetailsFacade } from '../root/facade';
import { CheckoutServiceDetailsConnector } from './connector';
import { CxDatePipe } from '@spartacus/core';

@NgModule({
  providers: [
    CheckoutServiceDetailsService,
    CheckoutServiceSchedulePickerService,
    {
      provide: CheckoutServiceDetailsFacade,
      useExisting: CheckoutServiceDetailsService,
    },
    CheckoutServiceDetailsConnector,
    CxDatePipe,
  ],
})
export class S4ServiceCoreModule {}
