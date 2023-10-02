/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { OpfErrorModalModule } from './opf-error-modal/opf-error-modal.module';

@NgModule({
  imports: [OpfErrorModalModule],
  providers: [],
})
export class OpfBaseComponentsModule {}
