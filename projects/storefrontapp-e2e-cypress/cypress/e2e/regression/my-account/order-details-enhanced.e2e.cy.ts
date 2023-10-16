/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { fillLoginForm } from '../../../helpers/auth-forms';
import { viewportContext } from '../../../helpers/viewport-context';
import { isolateTests } from '../../../support/utils/test-isolation';

describe('Order Details', { testIsolation: false }, () => {
  viewportContext(['desktop'], () => {
    isolateTests();
    before(() => {
      cy.window().then((win) => win.sessionStorage.clear());
      cy.visit('/');
    });

      beforeEach(() => {
        cy.restoreLocalStorage();
      });

    it('should navigate to login page and SignIn with user details', () => {
        cy.findByText(/Sign in \/ Register/i).click();
        fillLoginForm({ username: 'cdp.user@sap.com', password: 'Test@1' });
    });
    
    it('should navigate to Order History page', () => {
        let totalCount;
        cy.findByText(/My Account/i).click();
        cy.findByText(/Order History/i).click();
        cy.get('h2').contains('All Orders (2)');
        cy.get('.cx-order-history-extended-body > .cx-each-order').then((value) => {
            totalCount = 2;
            expect(value).to.have.length(totalCount);
        });
    });

    it('should navigate to view details of first order', () => {
        cy.get('.cx-enhanced-ui-order-history-code > a').first().click();
        cy.findByText(/Download Invoices/i).click();
        cy.get('.cx-modal-content').contains('Download Invoices');
        cy.get('.close').click();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });
  });
});
