/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  IconModule,
  KeyboardFocusModule,
  MediaModule,
} from '@spartacus/storefront';


import { ConfiguratorAttributeQuantityModule } from '../quantity/configurator-attribute-quantity.module';
import { ConfiguratorAttributeProductCardComponent } from './configurator-attribute-product-card.component';

@NgModule({
    exports: [ConfiguratorAttributeProductCardComponent],
    imports: [
    CommonModule,
    ConfiguratorAttributeQuantityModule,
    I18nModule,
    RouterModule,
    UrlModule,
    FormsModule,
    ReactiveFormsModule,
    MediaModule,
    KeyboardFocusModule,
    IconModule,
    ConfiguratorAttributeProductCardComponent,
],
})
export class ConfiguratorAttributeProductCardModule {}
