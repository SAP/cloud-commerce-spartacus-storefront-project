/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as login from '../../../helpers/login';
import { viewportContext } from '../../../helpers/viewport-context';

function assertNavigationButtonsAttributes(buttonsSelector: string) {
  cy.get(buttonsSelector).each(($btn) => {
    const btnAriaLabel = $btn.attr('aria-label');
    cy.wrap($btn)
      .should('have.attr', 'title', `${btnAriaLabel} Menu`)
      .should('have.attr', 'aria-label', btnAriaLabel)
      .should('have.attr', 'aria-controls', btnAriaLabel);
  });
}

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

      cy.get('cx-login button')
        .as('myAccountBtn')
        .contains('My Account')
        .invoke('attr', 'ariaLabel')
        .contains(`Hi, ${user.firstName} ${user.lastName}`);

      const mainCategoryMenuBrandsRootBtnSelector =
        'cx-category-navigation li[role="listitem"] button[aria-controls]';
      assertNavigationButtonsAttributes(mainCategoryMenuBrandsRootBtnSelector);

      login.signOutUser();
      cy.wait(tokenRevocationRequestAlias);
      cy.get('@myAccountBtn').should('not.exist');
      assertNavigationButtonsAttributes(mainCategoryMenuBrandsRootBtnSelector);
    });
  });
});
