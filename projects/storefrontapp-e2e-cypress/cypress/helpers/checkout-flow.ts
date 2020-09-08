import { products } from '../sample-data/apparel-checkout-flow';
import {
  cart,
  cartWithCheapProduct,
  cheapProduct,
  product,
  SampleCartProduct,
  SampleProduct,
  SampleUser,
  user,
} from '../sample-data/checkout-flow';
import { login, register } from './auth-forms';
import {
  AddressData,
  fillPaymentDetails,
  fillShippingAddress,
  PaymentDetails,
} from './checkout-forms';

export const ELECTRONICS_BASESITE = 'electronics-spa';
export const ELECTRONICS_CURRENCY = 'USD';

export const ELECTRONICS_DEFAULT_DELIVERY_MODE = 'deliveryMode-standard-net';

export function visitHomePage(queryStringParams?: string) {
  const homePage = waitForPage('homepage', 'getHomePage');

  if (queryStringParams) {
    cy.visit(`/?${queryStringParams}`);
  } else {
    cy.visit('/');
  }
  cy.wait(`@${homePage}`).its('status').should('eq', 200);
}

export function signOut() {
  cy.selectUserMenuOption({
    option: 'Sign Out',
  });
}

export function registerUser(
  giveRegistrationConsent: boolean = false,
  sampleUser: SampleUser = user
) {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.getByText(/Sign in \/ Register/i).click();
  cy.wait(`@${loginPage}`);

  const registerPage = waitForPage('/login/register', 'getRegisterPage');
  cy.getByText('Register').click();
  cy.wait(`@${registerPage}`);

  register(sampleUser, giveRegistrationConsent);
  cy.get('cx-breadcrumb').contains('Login');
  return sampleUser;
}

export function signInUser(sampleUser: SampleUser = user) {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.getByText(/Sign in \/ Register/i).click();
  cy.wait(`@${loginPage}`);
  login(sampleUser.email, sampleUser.password);
}

export function signOutUser(sampleUser: SampleUser = user) {
  const logoutPage = waitForPage('/logout', 'getLogoutPage');
  signOut();
  cy.wait(`@${logoutPage}`);
  cy.get('.cx-login-greet').should('not.contain', sampleUser.fullName);
}

export function goToProductDetailsPage() {
  cy.visit('/');
  // click big banner
  cy.get('.Section1 cx-banner').first().find('img').click({ force: true });
  // click small banner number 6 (would be good if label or alt text would be available)
  cy.get('.Section2 cx-banner:nth-of-type(6) img').click({ force: true });
  cy.get('cx-product-intro').within(() => {
    cy.get('.code').should('contain', product.code);
  });
  cy.get('cx-breadcrumb').within(() => {
    cy.get('h1').should('contain', product.name);
  });
}

export function addProductToCart() {
  cy.get('cx-item-counter').getByText('+').click();
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  cy.get('cx-added-to-cart-dialog').within(() => {
    cy.get('.cx-name .cx-link').should('contain', product.name);
    cy.getByText(/proceed to checkout/i).click();
  });
}

export function loginUser(sampleUser: SampleUser = user) {
  // Verify the user is prompted to login
  login(sampleUser.email, sampleUser.password);
}

export function fillAddressForm(shippingAddressData: AddressData = user) {
  cy.get('.cx-checkout-title').should('contain', 'Shipping Address');
  cy.get('cx-order-summary .cx-summary-partials .cx-summary-row')
    .first()
    .find('.cx-summary-amount')
    .should('contain', cart.total);
  fillShippingAddress(shippingAddressData);
}

export function verifyDeliveryMethod(
  deliveryMode: string = ELECTRONICS_DEFAULT_DELIVERY_MODE
) {
  cy.get('.cx-checkout-title').should('contain', 'Shipping Method');
  cy.get(`#${deliveryMode}`).should('be.checked');
  const paymentPage = waitForPage(
    '/checkout/payment-details',
    'getPaymentPage'
  );
  cy.get('.cx-checkout-btns button.btn-primary').click();
  cy.wait(`@${paymentPage}`).its('status').should('eq', 200);
}

export function fillPaymentForm(
  paymentDetailsData: PaymentDetails = user,
  billingAddress?: AddressData
) {
  cy.get('.cx-checkout-title').should('contain', 'Payment');
  cy.get('cx-order-summary .cx-summary-partials .cx-summary-total')
    .find('.cx-summary-amount')
    .should('contain', cart.totalAndShipping);
  fillPaymentDetails(paymentDetailsData, billingAddress);
}

export function verifyReviewOrderPage() {
  cy.get('.cx-review-title').should('contain', 'Review');
}

export function placeOrder() {
  verifyReviewOrderPage();
  cy.get('.cx-review-summary-card')
    .contains('cx-card', 'Ship To')
    .find('.cx-card-container')
    .within(() => {
      cy.getByText(user.fullName);
      cy.getByText(user.address.line1);
      cy.getByText(user.address.line2);
    });
  cy.get('.cx-review-summary-card')
    .contains('cx-card', 'Shipping Method')
    .find('.cx-card-container')
    .within(() => {
      cy.getByText('Standard Delivery');
    });
  cy.get('cx-order-summary .cx-summary-row .cx-summary-amount')
    .eq(0)
    .should('contain', cart.total);
  cy.get('cx-order-summary .cx-summary-row .cx-summary-amount')
    .eq(1)
    .should('contain', cart.estimatedShipping);
  cy.get('cx-order-summary .cx-summary-total .cx-summary-amount').should(
    'contain',
    cart.totalAndShipping
  );
  cy.getByText('Terms & Conditions')
    .should('have.attr', 'target', '_blank')
    .should(
      'have.attr',
      'href',
      `/${Cypress.env('BASE_SITE')}/en/USD/terms-and-conditions`
    );
  cy.get('.form-check-input').check();
  cy.get('cx-place-order button.btn-primary').click();
}

export function verifyOrderConfirmationPage() {
  cy.get('.cx-page-title').should('contain', 'Confirmation of Order');
  cy.get('h2').should('contain', 'Thank you for your order!');
  cy.get('.cx-order-review-summary .container').within(() => {
    cy.get('.summary-card:nth-child(1) .cx-card').within(() => {
      cy.contains(user.fullName);
      cy.contains(user.address.line1);
    });
    cy.get('.summary-card:nth-child(2) .cx-card').within(() => {
      cy.contains(user.fullName);
      cy.contains(user.address.line1);
    });
    cy.get('.summary-card:nth-child(3) .cx-card').within(() => {
      cy.contains('Standard Delivery');
    });
  });
  cy.get('cx-cart-item .cx-code').should('contain', product.code);
  cy.get('cx-order-summary .cx-summary-amount').should(
    'contain',
    cart.totalAndShipping
  );
}

export function viewOrderHistory() {
  cy.selectUserMenuOption({
    option: 'Order History',
  });
  cy.get('cx-order-history h3').should('contain', 'Order history');
  cy.get('.cx-order-history-table tr')
    .first()
    .find('.cx-order-history-total .cx-order-history-value')
    .should('contain', cart.totalAndShipping);
}

export function goToPaymentDetails() {
  cy.get('cx-checkout-progress li:nth-child(3) > a').click();
}

export function clickAddNewPayment() {
  cy.getByText('Add New Payment').click();
}

export function goToCheapProductDetailsPage(
  sampleProduct: SampleProduct = cheapProduct
) {
  visitHomePage();
  clickCheapProductDetailsFromHomePage(sampleProduct);
}

export function clickCheapProductDetailsFromHomePage(
  sampleProduct: SampleProduct = cheapProduct
) {
  const productCode = `ProductPage&code=${sampleProduct.code}`;
  const productPage = waitForPage(productCode, 'getProductPage');
  cy.get('.Section4 cx-banner').first().find('img').click({ force: true });
  cy.wait(`@${productPage}`).its('status').should('eq', 200);
  cy.get('cx-product-intro').within(() => {
    cy.get('.code').should('contain', sampleProduct.code);
  });
  cy.get('cx-breadcrumb').within(() => {
    cy.get('h1').should('contain', sampleProduct.name);
  });
}

export function addCheapProductToCartAndLogin(
  sampleUser: SampleUser = user,
  sampleProduct: SampleProduct = cheapProduct
) {
  addCheapProductToCart(sampleProduct);
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.getByText(/proceed to checkout/i).click();
  cy.wait(`@${loginPage}`);

  const shippingPage = waitForPage(
    '/checkout/shipping-address',
    'getShippingPage'
  );
  loginUser(sampleUser);
  cy.wait(`@${shippingPage}`).its('status').should('eq', 200);
}

export function addCheapProductToCartAndProceedToCheckout(
  sampleProduct: SampleProduct = cheapProduct
) {
  addCheapProductToCart(sampleProduct);
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.getByText(/proceed to checkout/i).click();
  cy.wait(`@${loginPage}`);
}

export function addCheapProductToCartAndBeginCheckoutForSignedInCustomer(
  sampleProduct: SampleProduct = cheapProduct
) {
  addCheapProductToCart(sampleProduct);
  const shippingPage = waitForPage(
    '/checkout/shipping-address',
    'getShippingPage'
  );
  cy.getByText(/proceed to checkout/i).click();
  cy.wait(`@${shippingPage}`).its('status').should('eq', 200);
}

export function addCheapProductToCart(
  sampleProduct: SampleProduct = cheapProduct
) {
  cy.get('cx-add-to-cart')
    .getByText(/Add To Cart/i)
    .click();
  cy.get('cx-added-to-cart-dialog').within(() => {
    cy.get('.cx-name .cx-link').should('contain', sampleProduct.name);
  });
}

export function fillAddressFormWithCheapProduct(
  shippingAddressData: AddressData = user,
  cartData: SampleCartProduct = cartWithCheapProduct
) {
  cy.get('.cx-checkout-title').should('contain', 'Shipping Address');
  cy.get('cx-order-summary .cx-summary-partials .cx-summary-row')
    .first()
    .find('.cx-summary-amount')
    .should('contain', cartData.total);
  const deliveryPage = waitForPage(
    '/checkout/delivery-mode',
    'getDeliveryPage'
  );
  fillShippingAddress(shippingAddressData);
  cy.wait(`@${deliveryPage}`).its('status').should('eq', 200);
}

export function fillPaymentFormWithCheapProduct(
  paymentDetailsData: PaymentDetails = user,
  billingAddress?: AddressData,
  cartData: SampleCartProduct = cartWithCheapProduct
) {
  cy.get('.cx-checkout-title').should('contain', 'Payment');
  cy.get('cx-order-summary .cx-summary-partials .cx-summary-total')
    .find('.cx-summary-amount')
    .should('contain', cartData.totalAndShipping);
  const reivewPage = waitForPage('/checkout/review-order', 'getReviewPage');
  fillPaymentDetails(paymentDetailsData, billingAddress);
  cy.wait(`@${reivewPage}`).its('status').should('eq', 200);
}

export function placeOrderWithCheapProduct(
  sampleUser: SampleUser = user,
  cartData: SampleCartProduct = cartWithCheapProduct,
  currency: string = 'USD'
) {
  verifyReviewOrderPage();
  cy.get('.cx-review-summary-card')
    .contains('cx-card', 'Ship To')
    .find('.cx-card-container')
    .within(() => {
      cy.getByText(sampleUser.fullName);
      cy.getByText(sampleUser.address.line1);
      cy.getByText(sampleUser.address.line2);
    });
  cy.get('.cx-review-summary-card')
    .contains('cx-card', 'Shipping Method')
    .find('.cx-card-container')
    .within(() => {
      cy.getByText('Standard Delivery');
    });
  cy.get('cx-order-summary .cx-summary-row .cx-summary-amount')
    .eq(0)
    .should('contain', cartData.total);
  cy.get('cx-order-summary .cx-summary-row .cx-summary-amount')
    .eq(1)
    .should('contain', cartData.estimatedShipping);
  cy.get('cx-order-summary .cx-summary-total .cx-summary-amount').should(
    'contain',
    cartData.totalAndShipping
  );
  cy.getByText('Terms & Conditions')
    .should('have.attr', 'target', '_blank')
    .should(
      'have.attr',
      'href',
      `/${Cypress.env('BASE_SITE')}/en/${currency}/terms-and-conditions`
    );
  cy.get('input[formcontrolname="termsAndConditions"]').check();
  const orderConfirmationPage = waitForPage(
    '/order-confirmation',
    'getOrderConfirmationPage'
  );
  cy.get('cx-place-order button.btn-primary').click();
  cy.wait(`@${orderConfirmationPage}`).its('status').should('eq', 200);
}

export function verifyOrderConfirmationPageWithCheapProduct(
  sampleUser: SampleUser = user,
  sampleProduct: SampleProduct = cheapProduct,
  cartData: SampleCartProduct = cartWithCheapProduct,
  isApparel: boolean = false
) {
  cy.get('.cx-page-title').should('contain', 'Confirmation of Order');
  cy.get('h2').should('contain', 'Thank you for your order!');
  cy.get('.cx-order-review-summary .container').within(() => {
    cy.get('.summary-card:nth-child(1)').within(() => {
      cy.get('cx-card:nth-child(1)').within(() => {
        cy.get('.cx-card-title').should('contain', 'Order Number');
        cy.get('.cx-card-label').should('not.be.empty');
      });
      cy.get('cx-card:nth-child(2)').within(() => {
        cy.get('.cx-card-title').should('contain', 'Placed on');
        cy.get('.cx-card-label').should('not.be.empty');
      });
      cy.get('cx-card:nth-child(3)').within(() => {
        cy.get('.cx-card-title').should('contain', 'Status');
        cy.get('.cx-card-label').should('not.be.empty');
      });
    });
    cy.get('.summary-card:nth-child(2) .cx-card').within(() => {
      cy.contains(sampleUser.fullName);
      cy.contains(sampleUser.address.line1);
      cy.contains('Standard Delivery');
    });
    cy.get('.summary-card:nth-child(3) .cx-card').within(() => {
      cy.contains(sampleUser.fullName);
      cy.contains(sampleUser.address.line1);
    });
  });
  if (!isApparel) {
    cy.get('cx-cart-item .cx-code').should('contain', sampleProduct.code);
  } else {
    cy.get('cx-cart-item .cx-code')
      .should('have.length', products.length)
      .each((_, index) => {
        console.log('products', products[index]);
        cy.get('cx-cart-item .cx-code').should('contain', products[index].code);
      });
  }
  cy.get('cx-order-summary .cx-summary-amount').should(
    'contain',
    cartData.totalAndShipping
  );
}

export function viewOrderHistoryWithCheapProduct(
  cartData: SampleCartProduct = cartWithCheapProduct
) {
  const orderHistoryPage = waitForPage(
    '/my-account/orders',
    'getOrderHistoryPage'
  );
  cy.selectUserMenuOption({
    option: 'Order History',
  });
  cy.wait(`@${orderHistoryPage}`).its('status').should('eq', 200);
  cy.get('cx-order-history h3').should('contain', 'Order history');
  cy.get('.cx-order-history-table tr')
    .first()
    .find('.cx-order-history-total .cx-order-history-value')
    .should('contain', cartData.totalAndShipping);
}

export function waitForPage(page: string, alias: string): string {
  cy.server();
  cy.route(
    'GET',
    `${Cypress.env('OCC_PREFIX')}/${Cypress.env(
      'BASE_SITE'
    )}/cms/pages?*${page}*`
  ).as(alias);
  return alias;
}
