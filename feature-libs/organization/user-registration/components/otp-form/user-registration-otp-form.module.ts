/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CmsConfig,
  ConfigModule,
  FeaturesConfigModule,
  I18nModule,
  NotAuthGuard,
  UrlModule,
} from '@spartacus/core';
import {
  FormErrorsModule,
  NgSelectA11yModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { UserRegistrationOTPFormService } from './user-registration-otp-form.service';
import { UserRegistrationOTPFormComponent } from './user-registration-otp-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    SpinnerModule,
    FormErrorsModule,
    NgSelectModule,
    NgSelectA11yModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        OneTimePasswordOrganizationUserRegistrationComponent: {
          component: UserRegistrationOTPFormComponent,
          guards: [NotAuthGuard],
        },
      },
    }),
    FeaturesConfigModule,
  ],
  declarations: [UserRegistrationOTPFormComponent],
  exports: [UserRegistrationOTPFormComponent],
  providers: [UserRegistrationOTPFormService],
})
export class UserRegistrationOTPFormModule {}
