/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { IconModule } from '../../../../cms-components/misc/icon/icon.module';
import { AvatarComponent } from './avatar.component';

@NgModule({
  imports: [CommonModule, I18nModule, IconModule],
  declarations: [AvatarComponent],
  exports: [AvatarComponent],
})
export class AvatarModule {}
