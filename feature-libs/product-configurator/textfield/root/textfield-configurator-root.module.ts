/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideDefaultConfig } from '@commerce-storefront-toolset/core';
import { CommonConfiguratorModule } from '@commerce-storefront-toolset/product-configurator/common';
import {
  CmsPageGuard,
  LayoutConfig,
  PageLayoutComponent,
} from '@commerce-storefront-toolset/storefront';
import { TextfieldConfiguratorRootFeatureModule } from './textfield-configurator-root-feature.module';
import { TextfieldConfiguratorRoutingModule } from './textfield-configurator-routing.module';

/**
 * Exposes the root modules that we need to statically load. Contains page mappings
 */
@NgModule({
  imports: [
    CommonModule,
    CommonConfiguratorModule,
    TextfieldConfiguratorRootFeatureModule,
    TextfieldConfiguratorRoutingModule.forRoot(),
    RouterModule.forChild([
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: PageLayoutComponent,
        data: {
          cxRoute: 'configureTEXTFIELD',
        },
        canActivate: [CmsPageGuard],
      },
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: PageLayoutComponent,
        data: {
          cxRoute: 'configureOverviewTEXTFIELD',
        },
        canActivate: [CmsPageGuard],
      },
    ]),
  ],
  providers: [
    provideDefaultConfig(<LayoutConfig>{
      layoutSlots: {
        TextfieldConfigurationTemplate: {
          slots: ['TextfieldConfigContent'],
        },
      },
    }),
  ],
})
export class TextfieldConfiguratorRootModule {
  static forRoot(): ModuleWithProviders<TextfieldConfiguratorRootModule> {
    return {
      ngModule: TextfieldConfiguratorRootModule,
    };
  }
}
