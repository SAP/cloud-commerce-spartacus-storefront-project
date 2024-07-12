/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import { KeyboardFocusModule } from '@spartacus/storefront';
import { ConfiguratorPriceModule } from '../../../price/configurator-price.module';
import { ConfiguratorShowMoreModule } from '../../../show-more/configurator-show-more.module';
import { ConfiguratorAttributeCompositionConfig } from '../../composition';
import { ConfiguratorAttributeCheckBoxComponent } from './configurator-attribute-checkbox.component';

@NgModule({
  imports: [
    KeyboardFocusModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    ConfiguratorPriceModule,
    ConfiguratorShowMoreModule,
  ],
  providers: [
    provideDefaultConfig(<ConfiguratorAttributeCompositionConfig>{
      productConfigurator: {
        assignment: {
          AttributeType_checkBox: ConfiguratorAttributeCheckBoxComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorAttributeCheckBoxComponent],
  exports: [ConfiguratorAttributeCheckBoxComponent],
})
export class ConfiguratorAttributeCheckboxModule {}
