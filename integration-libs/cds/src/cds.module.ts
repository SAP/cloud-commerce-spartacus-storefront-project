/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideConfigValidator, provideDefaultConfig } from '@spartacus/core';
import { CdsConfig, DEFAULT_CDS_CONFIG, cdsConfigValidator } from './config';
import { MerchandisingModule } from './merchandising';
import {
  ProfileTagModule,
  ProfileTagPushEventsService,
  TrackingModule,
} from './profiletag';
import { RecentSearchesModule } from './recent-searches/recent-searches.module';
import { TrendingSearchesModule } from './trending-searches/trending-searches.module';

@NgModule({
  imports: [
    ProfileTagModule,
    TrackingModule,
    MerchandisingModule,
    RecentSearchesModule,
    TrendingSearchesModule,
  ],
})
export class CdsModule {
  static forRoot(config?: CdsConfig): ModuleWithProviders<CdsModule> {
    return {
      ngModule: CdsModule,
      providers: [
        provideDefaultConfig(DEFAULT_CDS_CONFIG),
        provideDefaultConfig(config),
        provideConfigValidator(cdsConfigValidator),
        ProfileTagPushEventsService,
      ],
    };
  }
}
