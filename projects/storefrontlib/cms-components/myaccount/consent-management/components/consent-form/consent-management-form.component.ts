/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AnonymousConsent,
  ANONYMOUS_CONSENT_STATUS,
  ConsentTemplate,
  FeatureConfigService,
} from '@spartacus/core';

@Component({
  selector: 'cx-consent-management-form',
  templateUrl: './consent-management-form.component.html',
})
export class ConsentManagementFormComponent implements OnInit {
  consentGiven = false;

  @Input()
  consentTemplate: ConsentTemplate;

  @Input()
  requiredConsents: string[] = [];

  @Input()
  consent: AnonymousConsent | null;

  @Input() disabled: boolean = false;

  @Output()
  consentChanged = new EventEmitter<{
    given: boolean;
    template: ConsentTemplate;
  }>();

  get isConsentGiven(): boolean {
    if (this.consent) {
      return this.consent.consentState === ANONYMOUS_CONSENT_STATUS.GIVEN;
    }
    if (this.consentTemplate?.currentConsent) {
      return (
        !this.consentTemplate.currentConsent.consentWithdrawnDate &&
        !!this.consentTemplate.currentConsent.consentGivenDate
      );
    }
    return false;
  }

  private featureConfigService = inject(FeatureConfigService, {
    optional: true,
  });
  get useGetterForIsConsentGiven(): boolean {
    return !!this.featureConfigService?.isEnabled('useGetterForIsConsentGiven');
  }

  constructor() {
    // Intentional empty constructor
  }

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
        }
      }
    }
  }

  onConsentChange(): void {
    this.consentGiven = !this.consentGiven;

    this.consentChanged.emit({
      given: this.useGetterForIsConsentGiven
        ? !this.isConsentGiven
        : this.consentGiven,
      template: this.consentTemplate,
    });
  }

  isRequired(templateId: string | undefined): boolean {
    return templateId ? this.requiredConsents.includes(templateId) : false;
  }
}
