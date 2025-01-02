/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { BEFORE_CMS_PAGE_GUARD } from '@spartacus/storefront';
import { OppsLoginRequiredGuard } from './opps-login-required.guard';

@NgModule({
  providers: [
    {
      provide: BEFORE_CMS_PAGE_GUARD,
      useClass: OppsLoginRequiredGuard,
      multi: true,
    },
  ],
})
export class OppsLoginRequiredModule {}
