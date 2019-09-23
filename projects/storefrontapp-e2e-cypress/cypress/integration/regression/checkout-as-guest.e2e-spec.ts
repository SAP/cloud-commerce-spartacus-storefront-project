import { assertAddressForm } from '../../helpers/address-book';
import { login } from '../../helpers/auth-forms';
import * as guestCheckout from '../../helpers/checkout-as-guest';
import * as checkout from '../../helpers/checkout-flow';
import { waitForPage } from '../../helpers/checkout-flow';
import { validateUpdateProfileForm } from '../../helpers/update-profile';
import { cheapProduct, user } from '../../sample-data/checkout-flow';

context('Checkout as guest', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.cxConfig({ features: { guestCheckout: true } });
    cy.visit('/');
  });

  describe('Add product and proceed to checkout', () => {
    it('should add product to cart and go to login', () => {
      checkout.goToCheapProductDetailsPage();
      checkout.addCheapProductToCartAndProceedToCheckout();
    });

    it('should show the guest checkout button', () => {
      cy.get('.register').getByText(/Guest Checkout/i);
    });
  });

  describe('Login as guest', () => {
    it('should login as guest', () => {
      guestCheckout.loginAsGuest();
    });
  });

  describe('Checkout', () => {
    it('should fill in address form', () => {
      checkout.fillAddressFormWithCheapProduct();
    });

    it('should choose delivery', () => {
      checkout.chooseDeliveryMethod();
    });

    it('should fill in payment form', () => {
      checkout.fillPaymentFormWithCheapProduct();
    });

    it('should review and place order', () => {
      checkout.placeOrderWithCheapProduct();
    });

    it('should display summary page', () => {
      checkout.verifyOrderConfirmationPageWithCheapProduct();
    });
  });

  describe('Create account', () => {
    it('should create an account', () => {
      guestCheckout.createAccountFromGuest(user.password);
    });
  });

  describe('Guest account', () => {
    it('should be able to check order in order history', () => {
      checkout.viewOrderHistoryWithCheapProduct();
    });

    it('should show address in Address Book', () => {
      cy.selectUserMenuOption({
        option: 'Address Book',
      });

      assertAddressForm(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: '',
          address: user.address,
        },
        'US-CT'
      );
    });

    it('should show payment in Payment Methods', () => {
      cy.selectUserMenuOption({
        option: 'Payment Details',
      });

      cy.get('.cx-payment .cx-body').then(() => {
        cy.get('cx-card').should('exist');
      });
    });

    it('should show personal details in Personal Details', () => {
      cy.selectUserMenuOption({
        option: 'Personal Details',
      });

      validateUpdateProfileForm('mr', user.firstName, user.lastName);
      checkout.signOut();
    });
  });

  describe('Guest cart merge', () => {
    before(() => {
      cy.cxConfig({ features: { guestCheckout: true } });
    });
    it('should keep guest cart content and restart checkout', () => {
      checkout.goToCheapProductDetailsPage();
      checkout.addCheapProductToCartAndProceedToCheckout();

      guestCheckout.loginAsGuest();

      checkout.fillAddressFormWithCheapProduct();

      const shippingPage = checkout.waitForPage(
        '/checkout/shipping-address',
        'getShippingPage'
      );

      const loginPage = waitForPage('/login', 'getLoginPage');
      cy.getByText(/Sign in \/ Register/i).click();
      cy.wait(`@${loginPage}`);

      login(user.email, user.password);
      cy.wait(`@${shippingPage}`);

      cy.get('cx-mini-cart .count').contains('1');

      const cartPage = waitForPage('/cart', 'getCartPage');
      cy.get('cx-mini-cart').click();
      cy.wait(`@${cartPage}`);

      cy.get('cx-cart-item-list')
        .contains('cx-cart-item', cheapProduct.code)
        .within(() => {
          cy.get('.cx-counter-value').should('have.value', '1');
        });
    });
  });
});
