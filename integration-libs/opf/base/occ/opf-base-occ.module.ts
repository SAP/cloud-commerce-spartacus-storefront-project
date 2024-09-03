/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { OpfBaseAdapter } from '@spartacus/opf/base/core';
import { OccOpfBaseAdapter } from './adapters';
import { defaultOccOpfBaseConfig } from './config/default-occ-opf-base-config';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideDefaultConfig(defaultOccOpfBaseConfig),
    {
      provide: OpfBaseAdapter,
      useClass: OccOpfBaseAdapter,
    },
  ],
})
export class OpfBaseOccModule {}
