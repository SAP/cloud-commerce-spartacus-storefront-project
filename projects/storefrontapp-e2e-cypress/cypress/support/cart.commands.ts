/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { addToB2BCart, addToCart, createCart } from './utils/cart';

declare namespace Cypress {
  interface Chainable {
    /**
       * Creates a new cart and adds items to it
       * @memberof Cypress.Chainable
       * @example
        ```
        cy.addToCart(productCode, quantity, accessToken)
        ```
       */
    addToCart: (itemId: string, quantity: string, accessToken: string) => void;

    /**
       * Creates a new cart and adds items to B2B Cart
       * @memberof Cypress.Chainable
       * @example
        ```
        cy.addToB2BCart(productCode, quantity, accessToken)
        ```
       */
    addToB2BCart: (itemId: string, quantity: string, accessToken: string) => void;
  }
}

Cypress.Commands.add(
  'addToCart',
  (productCode: string, quantity: string, accessToken: string) => {
    createCart(accessToken).then((response) => {
      const cartId = response.body.code;
      addToCart(cartId, productCode, quantity, accessToken).then(() => {
        Cypress.log({
          name: 'addToCart',
          displayName: 'Add to cart',
          message: [`🛒 Product(s) added to cart`],
          consoleProps: () => {
            return {
              'Cart ID': cartId,
              'Product code': productCode,
              Quantity: quantity,
            };
          },
        });

        cy.wrap(cartId);
      });
    });
  }
);

Cypress.Commands.add(
  'addToB2BCart',
  (productCode: string, quantity: string, accessToken: string) => {
    createCart(accessToken).then((response) => {
      const cartId = response.body.code;
      addToB2BCart(cartId, productCode, quantity, accessToken).then(() => {
        Cypress.log({
          name: 'addToCart',
          displayName: 'Add to B2B cart',
          message: [`🛒 Product(s) added to cart`],
          consoleProps: () => {
            return {
              'Cart ID': cartId,
              'Product code': productCode,
              Quantity: quantity,
            };
          },
        });

        cy.wrap(cartId);
      });
    });
  }
);
