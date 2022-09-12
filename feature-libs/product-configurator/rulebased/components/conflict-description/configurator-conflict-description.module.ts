/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@commerce-storefront-toolset/storefront';
import { ConfiguratorConflictDescriptionComponent } from './configurator-conflict-description.component';

@NgModule({
  imports: [CommonModule, IconModule],
  declarations: [ConfiguratorConflictDescriptionComponent],
  exports: [ConfiguratorConflictDescriptionComponent],
})
export class ConfiguratorConflictDescriptionModule {}
