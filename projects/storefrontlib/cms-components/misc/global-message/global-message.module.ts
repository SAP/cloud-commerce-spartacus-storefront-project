/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@commerce-storefront-toolset/core';
import { IconModule } from '../../../cms-components/misc/icon/icon.module';
import { GlobalMessageComponent } from './global-message.component';

@NgModule({
  imports: [CommonModule, IconModule, I18nModule],
  declarations: [GlobalMessageComponent],
  exports: [GlobalMessageComponent],
})
export class GlobalMessageComponentModule {}
