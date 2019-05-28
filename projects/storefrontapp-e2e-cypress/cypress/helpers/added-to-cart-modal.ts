export const productId = '3595723';
export const productId2 = '3325048';

export function verifyItemCounterOnPDP() {
  // Type 1000 in the input to see if the value will change to maximum 'max stock'
  cy.get('cx-product-summary .cx-counter-value')
    .type('{selectall}{backspace}')
    .type('1000')
    .should('have.value', '22');

  // check if the '+' button is disabled when the quantity is the maximum 'max stock'
  cy.get('cx-product-summary .cx-counter-action')
    .contains('+')
    .should('be.disabled');

  // Type 0 in the input to see if the value will change to minimum '1'
  cy.get('cx-product-summary .cx-counter-value')
    .type('{selectall}{backspace}')
    .type('0')
    .should('have.value', '1');

  // check if the '-' button is disabled when the quantity is the minimum '1'
  cy.get('cx-product-summary .cx-counter-action')
    .contains('-')
    .should('be.disabled');
}

export function addSameProductTwice() {
  // add a product to cart
  cy.visit(`/product/${productId}`);
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();

  cy.get('cx-added-to-cart-dialog .cx-quantity .cx-counter-value').should(
    'have.value',
    '1'
  );
  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    '1 item'
  );
  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();

  // add same product to cart again
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();

  // quantity is correctly updated
  cy.get('cx-added-to-cart-dialog .cx-quantity .cx-counter-value').should(
    'have.value',
    '2'
  );
  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    '2 items'
  );

  // action buttons links correctly
  cy.get('cx-added-to-cart-dialog .btn-primary')
    .should('have.attr', 'href')
    .then($href => {
      expect($href).contain('/cart');
    });
  cy.get('cx-added-to-cart-dialog .btn-secondary')
    .should('have.attr', 'href')
    .then($href => {
      expect($href).contain('/checkout');
    });

  // closing modal works
  cy.get('cx-added-to-cart-dialog [aria-label="Close"]').click();
  cy.get('cx-added-to-cart-dialog').should('not.exist');
}

export function addDifferentProducts() {
  // uncomment this section after fixing cart resetting on each full page load (issue 787)
  // cy.visit('/');

  // search for new product and select it, and add to cart
  cy.get('cx-searchbox [aria-label="search"]').type(productId2);
  cy.get('cx-searchbox')
    .contains('.cx-product', 'DSC-W180')
    .click();
  cy.get('cx-breadcrumb h1').contains('DSC-W180');
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();

  // quantity is correctly updated
  cy.get('cx-added-to-cart-dialog .cx-quantity .cx-counter-value').should(
    'have.value',
    '1'
  );
  cy.get('cx-added-to-cart-dialog .cx-dialog-total').should(
    'contain',
    '3 items'
  );

  // check if the total is correct
  cy.get('cx-added-to-cart-dialog .cx-total .cx-value').then(
    $cartTotalItemPrice => {
      const totalPrice = $cartTotalItemPrice.text().trim();
      expect(totalPrice).equal('$121.88');
    }
  );

  // navigate to cart details
  cy.get('cx-added-to-cart-dialog .btn-primary').click();
  cy.get('cx-breadcrumb h1').should('contain', 'Your Shopping Cart');

  // delete a product and check if the total is updated
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'F 100mm f/2.8L Macro IS USM')
    .find('.cx-actions .link')
    .click();
  cy.get('cx-cart-details').should('contain', 'Cart total (1 item)');

  // check for the other product still exist
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'DSC-W180')
    .should('be.visible');

  // check the item quantity of the product
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'DSC-W180')
    .find('.cx-counter-value')
    .should('have.value', '1');

  // check the item price of the product
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'DSC-W180')
    .find('.cx-price .cx-value')
    .then($cartItemPrice => {
      const price = $cartItemPrice.text().trim();
      expect(price).equal('$121.88');
    });

  // check the item price total of the product
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'DSC-W180')
    .find('.cx-total .cx-value')
    .then($cartTotalItemPrice => {
      const totalPrice = $cartTotalItemPrice.text().trim();
      expect(totalPrice).equal('$121.88');
    });

  // delete the last product in cart
  cy.get('cx-cart-item-list .cx-item-list-items')
    .contains('.cx-info', 'DSC-W180')
    .find('.cx-actions .link')
    .click();

  // check if the cart is empty
  cy.get('cx-paragraph').should('contain', 'Your shopping cart is empty');
}

export function refreshPage() {
  cy.visit(`/product/${productId}`);

  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();

  cy.reload();

  cy.get('cx-added-to-cart-dialog').should('not.exist');
}

export function increaseProductQtyOnPDP() {
  // helper function to prettify the text
  function extractPriceFromText(text) {
    return parseFloat(
      text
        .trim()
        .substring(1)
        .replace(',', '')
    );
  }

  cy.visit(`/product/${productId}`);

  // increase the quantity to 2 and add it to cart
  cy.get('cx-product-summary cx-item-counter')
    .contains('+')
    .click();
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  // check if the item price * quantity matches the total
  cy.get('cx-added-to-cart-dialog').within(() => {
    cy.get('.cx-price .cx-value').then($itemPrice => {
      cy.get('.cx-quantity .cx-counter-value').then($itemQuantity => {
        cy.get('.cx-total .cx-value').then($itemTotalPrice => {
          expect(extractPriceFromText($itemTotalPrice.text())).equal(
            extractPriceFromText($itemPrice.text()) *
              parseInt($itemQuantity.val().toString(), 10)
          );
        });
      });
    });
  });
}
