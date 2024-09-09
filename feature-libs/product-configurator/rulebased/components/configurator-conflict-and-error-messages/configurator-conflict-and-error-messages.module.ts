/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { ConfiguratorConflictAndErrorMessagesComponent } from './configurator-conflict-and-error-messages.component';

@NgModule({
    imports: [CommonModule, RouterModule, UrlModule, I18nModule, IconModule, ConfiguratorConflictAndErrorMessagesComponent],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                CpqConfiguratorConflictAndErrorMessagesComponent: {
                    component: ConfiguratorConflictAndErrorMessagesComponent,
                },
            },
        }),
    ],
    exports: [ConfiguratorConflictAndErrorMessagesComponent],
})
export class ConfiguratorConflictAndErrorMessagesModule {}
