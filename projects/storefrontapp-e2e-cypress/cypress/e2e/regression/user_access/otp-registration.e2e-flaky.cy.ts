/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as login from '../../../helpers/login';
import { viewportContext } from '../../../helpers/viewport-context';
import { user } from '../../../sample-data/checkout-flow';
import { interceptPost } from '../../../support/utils/intercept';

export function listenForCreateRegistrationVerificationToken(): string {
  return interceptPost(
    'createRegistrationVerificationToken',
    '/users/anonymous/verificationToken?*'
  );
}

export function listenForUserRegistrationVerficationCodeEmailReceive(
  customerEmail: string
) {
  const mailCCV2Url =
    Cypress.env('MAIL_CCV2_URL') +
    Cypress.env('MAIL_CCV2_PREFIX') +
    '/search?query=' +
    customerEmail +
    '&kind=to';

  cy.request({
    method: 'GET',
    url: mailCCV2Url,
  }).then((response) => {
    if (response.body.total != 1) {
      listenForUserRegistrationVerficationCodeEmailReceive(customerEmail);
    }
  });
}

describe('OTP Registration', () => {
  viewportContext(['mobile'], () => {
    describe('Create OTP For Registration', () => {
      beforeEach(() => {
        cy.visit('/login/register');
      });

      it('should be able to create a new OTP by customer click Continue button (CXSPA-3919)', () => {
        listenForCreateRegistrationVerificationToken();

        cy.log(`create verification token from the register form`);
        cy.get('cx-otp-register-form form').within(() => {
          cy.get('ng-select[formcontrolname="titleCode"]')
            .click()
            .get('div.ng-option')
            .contains('Mr')
            .click();
          cy.get('[formcontrolname="firstName"]').clear().type(user.firstName);
          cy.get('[formcontrolname="lastName"]').clear().type(user.lastName);
          cy.get('[formcontrolname="email"]').clear().type(user.email);
          cy.get('[formcontrolname="termsandconditions"]').click();
          cy.get('button[type=submit]').click();
        });

        cy.wait('@createRegistrationVerificationToken')
          .its('response.statusCode')
          .should('eq', 201);

        cy.get('cx-registration-verification-token-form').should('exist');
        cy.get('cx-registration-verification-token-form').should('be.visible');

        listenForUserRegistrationVerficationCodeEmailReceive(user.email);

        const mailCCV2Url =
          Cypress.env('MAIL_CCV2_URL') +
          Cypress.env('MAIL_CCV2_PREFIX') +
          '/search?query=' +
          user.email +
          '&kind=to&start=0&limit=1';

        cy.request({
          method: 'GET',
          url: mailCCV2Url,
        }).then((response) => {
          console.log('Response Status:', response.status);
          console.log('Response Body:', response.body);
          const verificationCodeEmailStartText =
            'Please use the following verification code to register in Spartacus Electronics Site:</p>';
          const lableP = '<p>';

          const items = response.body.items;
          const emailBody = items[0].Content.Body;

          const verificationCodeEmailStartIndex =
            emailBody.indexOf(verificationCodeEmailStartText) +
            verificationCodeEmailStartText.length;
          const verificationCodeStartIndex =
            emailBody.indexOf(lableP, verificationCodeEmailStartIndex) +
            lableP.length;
          const verificationCode = emailBody.substring(
            verificationCodeStartIndex,
            verificationCodeStartIndex + 8
          );
          cy.log('Extracted verification code: ' + verificationCode);

          login.listenForTokenAuthenticationRequest();
          cy.get('cx-registration-verification-token-form').within(() => {
            cy.get('[formcontrolname="tokenCode"]')
              .clear()
              .type(verificationCode);
            cy.get('[formcontrolname="password"]').clear().type(user.password);
            cy.get('[formcontrolname="passwordconf"]')
              .clear()
              .type(user.password);
            cy.get('button[type=submit]').click();
          });
          cy.get('cx-login').should('exist');
        });
      });
      it('should be able to create a new OTP by customer click Continue button (CXSPA-3919)', () => {
        listenForCreateRegistrationVerificationToken();

        cy.log(`create verification token from the register form`);
        cy.get('cx-otp-register-form form').within(() => {
          cy.get('ng-select[formcontrolname="titleCode"]')
            .click()
            .get('div.ng-option')
            .contains('Mr')
            .click();
          cy.get('[formcontrolname="firstName"]').clear().type(user.firstName);
          cy.get('[formcontrolname="lastName"]').clear().type(user.lastName);
          cy.get('[formcontrolname="email"]').clear().type(user.email);
          cy.get('[formcontrolname="termsandconditions"]').click();
          cy.get('button[type=submit]').click();
        });

        cy.wait('@createRegistrationVerificationToken')
          .its('response.statusCode')
          .should('eq', 201);
        const verificationCode = 'invalidCode';

        cy.get('cx-registration-verification-token-form').should('exist');
        cy.get('cx-registration-verification-token-form').should('be.visible');
        cy.get('cx-registration-verification-token-form').within(() => {
          cy.get('[formcontrolname="tokenCode"]')
            .clear()
            .type(verificationCode);
          cy.get('[formcontrolname="password"]').clear().type(user.password);
          cy.get('[formcontrolname="passwordconf"]')
            .clear()
            .type(user.password);
          cy.get('button[type=submit]').click();
        });
        cy.get('cx-form-errors')
          .should('be.visible')
          .and('contain.text', 'This code is not invalid');
      });
    });

    describe('Verification token', () => {
      beforeEach(() => {
        cy.visit('/register/verify-token');
      });
      it('Should go back to register page when click back button (CXSPA-3919)', () => {
        cy.get('cx-registration-verification-token-form').should('exist');

        cy.get('cx-registration-verification-token-form form').within(() => {
          cy.get('div.verify-container button').contains('Back').click();
        });

        cy.get('cx-registration-verification-token-form').should('not.exist');
        cy.get('cx-otp-register-form form').should('exist');
      });
    });
  });
});
