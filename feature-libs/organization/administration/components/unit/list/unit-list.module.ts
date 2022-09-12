/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@commerce-storefront-toolset/core';
import { UnitListComponent } from './unit-list.component';
import { IconModule } from '@commerce-storefront-toolset/storefront';
import { ListModule } from '../../shared/list/list.module';
import { ToggleLinkCellComponent } from './toggle-link/toggle-link-cell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    IconModule,
    ListModule,
  ],
  declarations: [UnitListComponent, ToggleLinkCellComponent],
})
export class UnitListModule {}
