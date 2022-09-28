/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideDefaultConfig } from '@spartacus/core';
import {
  CartPickupOptionsContainerModule,
  defaultPickupOptionsDialogLayoutConfig,
  PdpPickupOptionsContainerModule,
  PickupInfoContainerModule,
} from './container/index';
@NgModule({
  imports: [
    ReactiveFormsModule,
    CartPickupOptionsContainerModule,
    PdpPickupOptionsContainerModule,
    PickupInfoContainerModule,
  ],
  providers: [provideDefaultConfig(defaultPickupOptionsDialogLayoutConfig)],
})
export class PickupInStoreComponentsModule {}
