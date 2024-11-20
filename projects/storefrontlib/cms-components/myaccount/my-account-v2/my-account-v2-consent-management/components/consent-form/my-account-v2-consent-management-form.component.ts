/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { ANONYMOUS_CONSENT_STATUS } from '@spartacus/core';
import { ConsentManagementFormComponent } from '../../../../consent-management/components/consent-form/consent-management-form.component';
import { MockTranslatePipe } from '../../../../../../../core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../core/src/i18n/translate.pipe';
import { NgIf } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-consent-management-form',
  templateUrl: './my-account-v2-consent-management-form.component.html',
  standalone: true,
  imports: [NgIf, TranslatePipe, MockTranslatePipe],
})
export class MyAccountV2ConsentManagementFormComponent
  extends ConsentManagementFormComponent
  implements OnInit
{
  consentApprovedTime: string;

  ngOnInit(): void {
    if (this.consent) {
      this.consentGiven = Boolean(
        this.consent.consentState === ANONYMOUS_CONSENT_STATUS.GIVEN
      );
    } else {
      if (this.consentTemplate && this.consentTemplate.currentConsent) {
        if (this.consentTemplate.currentConsent.consentWithdrawnDate) {
          this.consentGiven = false;
        } else if (this.consentTemplate.currentConsent.consentGivenDate) {
          this.consentGiven = true;
          const date = new Date(
            this.consentTemplate.currentConsent.consentGivenDate
          );
          this.consentApprovedTime = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        }
      }
    }
  }
}
