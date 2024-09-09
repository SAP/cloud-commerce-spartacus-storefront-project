/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import {
  IconModule,
  KeyboardFocusModule,
  PopoverModule,
} from '@spartacus/storefront';
import { ConfiguratorAttributeSingleSelectionImageComponent } from './configurator-attribute-single-selection-image.component';

import { ConfiguratorAttributeCompositionConfig } from '../../composition/configurator-attribute-composition.config';

@NgModule({
    imports: [
    KeyboardFocusModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    IconModule,
    PopoverModule,
    ConfiguratorAttributeSingleSelectionImageComponent,
],
    providers: [
        provideDefaultConfig(<ConfiguratorAttributeCompositionConfig>{
            productConfigurator: {
                assignment: {
                    AttributeType_single_selection_image: ConfiguratorAttributeSingleSelectionImageComponent,
                    AttributeType_read_only_single_selection_image: ConfiguratorAttributeSingleSelectionImageComponent,
                },
            },
        }),
    ],
    exports: [ConfiguratorAttributeSingleSelectionImageComponent],
})
export class ConfiguratorAttributeSingleSelectionImageModule {}
