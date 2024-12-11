/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { AtMessageDirective } from './assistive-technology-message.directive';

@NgModule({
  imports: [AtMessageDirective],
  exports: [AtMessageDirective],
})
export class AtMessageModule {}
