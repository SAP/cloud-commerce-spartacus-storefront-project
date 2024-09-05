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
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';

import { IconModule } from '../../misc/icon/icon.module';
import { NavigationUIComponent } from './navigation-ui.component';
import { NavigationComponent } from './navigation.component';

@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    IconModule,
    I18nModule,
    FeaturesConfigModule,
    NavigationComponent, NavigationUIComponent,
],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                NavigationComponent: {
                    component: NavigationComponent,
                },
            },
        }),
    ],
    exports: [NavigationComponent, NavigationUIComponent],
})
export class NavigationModule {}
