/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { OpfCtaCoreModule } from '@spartacus/opf/cta/core';
import { OpfCtaOccModule } from '@spartacus/opf/cta/occ';

@NgModule({
  imports: [OpfCtaCoreModule, OpfCtaOccModule],
})
export class OpfCtaModule {}
