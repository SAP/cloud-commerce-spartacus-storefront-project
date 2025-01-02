/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  OutletPosition,
  provideOutlet,
  SearchBoxModule,
  SearchBoxOutlets,
} from '@spartacus/storefront';
import { TrendingSearchesComponent } from './trending-searches.component';

@NgModule({
  exports: [],
  declarations: [TrendingSearchesComponent],
  imports: [CommonModule, I18nModule, SearchBoxModule, UrlModule, RouterModule],
  providers: [
    provideOutlet({
      id: SearchBoxOutlets.TRENDING_SEARCHES,
      component: TrendingSearchesComponent,
      position: OutletPosition.AFTER,
    }),
  ],
})
export class TrendingSearchesModule {}
