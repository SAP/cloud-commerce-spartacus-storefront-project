import { AnonymousConsentsConfig } from './anonymous-consents-config';

export const defaultAnonymousConsentsConfig: AnonymousConsentsConfig = {
  anonymousConsents: {
    footerLink: true,
    registerConsent: 'MARKETING_NEWSLETTER',
    showLegalDescriptionInDialog: true,
    consentManagementPage: {
      showAnonymousConsents: true,
      hideConsents: [],
    },
  },
};
