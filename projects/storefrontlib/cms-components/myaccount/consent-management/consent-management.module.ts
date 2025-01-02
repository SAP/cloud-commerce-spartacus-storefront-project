/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AuthGuard,
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { IconModule } from '../../misc/icon/icon.module';
import { MyAccountV2ConsentManagementComponent } from '../my-account-v2/my-account-v2-consent-management';
import { USE_MY_ACCOUNT_V2_CONSENT } from '../my-account-v2/use-my-account-v2-consent-notification-perference';
import { ConsentManagementFormComponent } from './components/consent-form/consent-management-form.component';
import { ConsentManagementComponent } from './components/consent-management.component';
import { ConsentManagementComponentService } from './consent-management-component.service';

const myAccountV2CmsMapping: CmsConfig = {
  cmsComponents: {
    ConsentManagementComponent: {
      component: MyAccountV2ConsentManagementComponent,
      //guards: inherited from standard config,
    },
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    I18nModule,
    IconModule,
    FeaturesConfigModule,
  ],
  providers: [
    ConsentManagementComponentService,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ConsentManagementComponent: {
          component: ConsentManagementComponent,
          guards: [AuthGuard],
        },
      },
    }),
    provideDefaultConfigFactory(() =>
      inject(USE_MY_ACCOUNT_V2_CONSENT) ? myAccountV2CmsMapping : {}
    ),
  ],
  declarations: [ConsentManagementComponent, ConsentManagementFormComponent],
  exports: [ConsentManagementComponent, ConsentManagementFormComponent],
})
export class ConsentManagementModule {}
