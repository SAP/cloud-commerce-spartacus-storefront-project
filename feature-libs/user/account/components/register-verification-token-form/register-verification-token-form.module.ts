/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AuthService,
  CmsConfig,
  FeaturesConfigModule,
  GlobalMessageService,
  I18nModule,
  NotAuthGuard,
  UrlModule,
  WindowRef,
  provideDefaultConfig,
} from '@spartacus/core';
import {
  FormErrorsModule,
  IconModule,
  KeyboardFocusModule,
  SpinnerModule,
} from '@spartacus/storefront';

import { defaultVerificationTokenLayoutConfig } from '../verification-token-form/default-verification-token-layout.config';
import { RegisterVerificationTokenFormComponentService } from './register-verification-token-form-component.service';
import { RegisterVerificationTokenFormComponent } from './register-verification-token-form.component';
import { VerificationTokenFacade } from '@spartacus/user/account/root';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    KeyboardFocusModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    IconModule,
    I18nModule,
    FormErrorsModule,
    SpinnerModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        RegisterVerifyOTPTokenComponent: {
          component: RegisterVerificationTokenFormComponent,
          guards: [NotAuthGuard],
          providers: [
            {
              provide: RegisterVerificationTokenFormComponentService,
              useClass: RegisterVerificationTokenFormComponentService,
              deps: [
                AuthService,
                GlobalMessageService,
                VerificationTokenFacade,
                WindowRef,
              ],
            },
          ],
        },
      },
    }),
    provideDefaultConfig(defaultVerificationTokenLayoutConfig),
  ],
  declarations: [
    RegisterVerificationTokenFormComponent,
  ],
})
export class RegisterVerificationTokenFormModule {}
