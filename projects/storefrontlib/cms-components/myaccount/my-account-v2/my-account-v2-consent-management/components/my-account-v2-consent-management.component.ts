/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { ConsentManagementComponent } from '../../../consent-management/components/consent-management.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { FeatureDirective } from '../../../../../../core/src/features-config/directives/feature.directive';
import { MyAccountV2ConsentManagementFormComponent } from './consent-form/my-account-v2-consent-management-form.component';
import { TranslatePipe } from '../../../../../../core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-my-account-v2-consent-management',
  templateUrl: './my-account-v2-consent-management.component.html',
  imports: [
    NgIf,
    SpinnerComponent,
    FeatureDirective,
    NgFor,
    MyAccountV2ConsentManagementFormComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class MyAccountV2ConsentManagementComponent extends ConsentManagementComponent {}
