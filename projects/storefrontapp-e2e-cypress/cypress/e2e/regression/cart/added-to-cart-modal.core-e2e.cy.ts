/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { viewportContext } from '../../../helpers/viewport-context';
const productId = '266685';
const productName = 'Battery Video Light';

describe('Added to cart modal - Anonymous user', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
  viewportContext(['desktop'], () => {
    before(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      cy.visit(`/product/${productId}/${productName}`);
    });

    it('Should add products to cart', () => {
      cy.visit(`/product/${productId}/${productName}`);
      cy.get('cx-add-to-cart button[type=submit]').click();

      cy.get('cx-added-to-cart-dialog').within(() => {
        //check for initial default values
        cy.get('.cx-quantity cx-item-counter input').should('have.value', '1');
        cy.get('.cx-dialog-total').should('contain', '1 item');
        cy.get('[aria-label="Close Modal"]').click();
      });

      cy.get('cx-add-to-cart button[type=submit]').click();

      cy.get('cx-added-to-cart-dialog').within(() => {
        cy.get('.cx-quantity cx-item-counter input').should('have.value', '2');
        cy.get('.cx-dialog-total').should('contain', '2 items');

        // check action button links
        cy.get('.btn-primary')
          .should('have.attr', 'href')
          .then(($href) => {
            expect($href).contain('/cart');
          });
        cy.get('.btn-secondary')
          .should('have.attr', 'href')
          .then(($href) => {
            expect($href).contain('/checkout');
          });

        cy.get('[aria-label="Close Modal"]').click();
        // Removed non-core validation. Longer test in added-to-cart-modal spec file.
      });
    });
  });
});
