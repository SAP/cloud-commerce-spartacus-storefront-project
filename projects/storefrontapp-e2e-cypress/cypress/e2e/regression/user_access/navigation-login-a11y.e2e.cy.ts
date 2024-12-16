/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as login from '../../../helpers/login';
import { viewportContext } from '../../../helpers/viewport-context';

describe('Navigation Login', () => {
  let user;
  viewportContext(['desktop'], () => {
    before(() => {
      cy.visit('/login');
      user = login.registerUserFromLoginPage();
    });

    it('should login and logout successfully and have correct Navigation Menu buttons values', () => {
      login.loginUser();

      const tokenRevocationRequestAlias =
        login.listenForTokenRevocationRequest();

      cy.get(
        'cx-login > cx-page-slot > cx-navigation > cx-navigation-ui > nav > ul > li > button'
      )
        .contains('My Account')
        .invoke('attr', 'ariaLabel')
        .contains(`Hi, ${user.firstName} ${user.lastName}`);

      cy.get(
        'cx-page-slot[position="NavigationBar"] > cx-category-navigation > cx-navigation-ui > nav > ul button[aria-label="Brands"]'
      )
        .should('have.attr', `title`)
        .should('eq', `Brands Menu`);

      login.signOutUser();
      cy.wait(tokenRevocationRequestAlias);
      cy.get(
        'cx-login > cx-page-slot > cx-navigation > cx-navigation-ui > nav > ul > li > button'
      ).should('not.exist');
      cy.get(
        'cx-page-slot[position="NavigationBar"] > cx-category-navigation > cx-navigation-ui > nav > ul button[aria-label="Brands"]'
      )
        .should('have.attr', `title`)
        .should('eq', `Brands Menu`);
    });
  });
});
