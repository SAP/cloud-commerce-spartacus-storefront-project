/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export function mockLocation(
  latitude: number,
  longitude: number
): Partial<Cypress.VisitOptions> {
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
        (successCallback, errorCallback, _options) => {
          if (typeof latitude === 'number' && typeof longitude === 'number') {
            return successCallback({ coords: { latitude, longitude } });
          }

          throw errorCallback({ code: 1 });
        }
      );
    },
  };
}

export const isSorted = (arr: any[]) => {
  let second_index;
  for (let first_index = 0; first_index < arr.length; first_index++) {
    second_index = first_index + 1;
    if (arr[second_index] - arr[first_index] < 0) return false;
  }
  return true;
};

const BOPIS_TAG = 'cx-pickup-options';
const CHECKOUT_ADDRESS_FORM_LOCATORS = {
  ADDRESS_FORM_COUNTRY: '#country-select',
  ADDRESS_FORM_COUNTRY_OPTION: '#country-select .ng-option',
  ADDRESS_FORM_TITLE: '#title-select',
  ADDRESS_FORM_TITLE_OPTION: '#title-select .ng-option',
  ADDRESS_FORM_FIRST_NAME: '[formcontrolname="firstName"]',
  ADDRESS_FORM_LAST_NAME: '[formcontrolname="lastName"]',
  ADDRESS_FORM_LINE_1: '[formcontrolname="line1"]',
  ADDRESS_FORM_LINE_2: '[formcontrolname="line2"]',
  ADDRESS_FORM_TOWN: '[formcontrolname="town"]',
  ADDRESS_FORM_POSTAL_CODE: '[formcontrolname="postalCode"]',
};

export const CHECKOUT_PAYMENT_FORM_LOCATORS = {
  PAYMENT_CARD_TYPE: '#card-type-select',
  PAYMENT_CARD_TYPE_OPTION: '#card-type-select .ng-option',
  ACCOUNT_HOLDER_NAME: '[formcontrolname="accountHolderName"]',
  CARD_NUMBER: '[formcontrolname="cardNumber"]',
  CARD_EXPIRY_MONTH: '#month-select',
  CARD_EXPIRY_MONTH_OPTION: '#month-select .ng-option',
  CARD_EXPIRY_YEAR: '#year-select',
  CARD_EXPIRY_YEAR_OPTION: '#year-select .ng-option',
  CARD_CVV: '#cVVNumber',
};

export const REVIEW_ORDER_LOCATORS = {
  REVIEW_ORDER_TERM_CONDITION:
    'cx-place-order [formcontrolname="termsAndConditions"]',
  REVIEW_ORDER_SUBMIT: 'cx-place-order  button.btn.btn-primary.btn-block',
};

export const LOCATORS = {
  USE_MY_LOCATION: '#lnkUseMyLocation',
  PICKUP_FROM_HERE_BUTTON_NOTTINGHAM_ICE_CENTER: `[data-pickup-in-store-button="Nottingham Ice Center"]`,
  ADD_TO_CART: 'span[aria-label="Add to cart"]',
  VIEW_CART: 'a[cxmodalreason="View Cart click"]',
  BOPIS_TAG,
  PICKUP_IN_STORE_MODAL: 'cx-delivery-pickup-options-dialog',
  HIDE_OUT_OF_STOCK_CHECK_BOX: '#chkHideOutOfStock',
  SEARCH_LOCATION_TEXTBOX: '#txtFindAStore',
  FIND_STORES_BUTTON: '#btnFindStores',
  SELECT_STORE_LINK: `${BOPIS_TAG} a.cx-action-link`,
  DIALOG_CLOSE: 'button.cx-dialog-close',
  ALLOW_COOKIES_BUTTON: `cx-anonymous-consent-management-banner button.btn-primary`,
  ACTIVE_PICK_UP_IN_STORE_BUTTON: `div.cx-store-pick-up-from-here button[data-pickup-in-store-button]:not([disabled])`,
  CHANGE_STORE_LINK: `a[data-change-store-location-link]`,
  PICKUP_STORE_LOCATION: `[data-pickup-location]`,
  PICKUP_STORE_LOCATION_NOT_VALUE: (value) =>
    `[data-pickup-location]:not([data-pickup-location="${value}"])[data-pickup-location]:not([data-pickup-location=""]) `,
  SAP_ICON_HOME_LINK: `.SiteLogo cx-banner cx-generic-link a`,
  HOME_PAGE_FIRST_PRODUCT: `:nth-child(1) > cx-carousel > .carousel-panel > .slides > .slide.active > :nth-child(1) > cx-product-carousel-item > a > .is-initialized > img`,
  HOME_PAGE_SECOND_PRODUCT: `:nth-child(1) > cx-carousel > .carousel-panel > .slides > .slide.active > :nth-child(2) > cx-product-carousel-item > a > .is-initialized > img`,
  PICKUP_OPTIONS_RADIO: `[data-pickup]`,
  PICKUP_OPTIONS_RADIO_DELIVERY: `[data-pickup=delivery]`,
  PICKUP_OPTIONS_RADIO_DELIVERY_CHECKED: `[data-pickup=delivery][aria-checked=true]`,
  PICKUP_OPTIONS_RADIO_DELIVERY_UNCHECKED: `[data-pickup=delivery][aria-checked=false]`,
  PICKUP_OPTIONS_RADIO_PICKUP: `[data-pickup=pickup]`,
  PICKUP_OPTIONS_RADIO_PICKUP_CHECKED: `[data-pickup=pickup][aria-checked=true]`,
  PICKUP_OPTIONS_RADIO_PICKUP_UNCHECKED: `[data-pickup=pickup][aria-checked=false]`,
  LOGIN_LINK: `cx-login a`,
  REGISTER_BUTTON: `cx-login-register a`,
  FORM_TITLE: `#title-select`,
  FORM_TITLE_ENTRY_MR: `div.ng-option:contains('Mr.')`,
  FORM_FIRSTNAME: `input[name=firstname]`,
  FORM_LASTNAME: `input[name=lastname]`,
  FORM_EMAIL: `input[name=email]`,
  FORM_PASSWORD: `input[name=password]`,
  FORM_CONFIRM_PASSWORD: `input[name=confirmpassword]`,
  FORM_NEWSLETTER: `input[name=newsletter]`,
  FORM_TANDC: `input[name=termsandconditions]`,
  SUBMIT_REGISTRATION_FORM: `button[type=submit]:contains("Register")`,
  SIGN_IN_BUTTON: `button[type=submit]:contains("Sign In")`,
  SIGNIN_USERNAME: `input[formcontrolname="userId"]`,
  SIGNIN_PASSWORD: `input[formcontrolname="password"]`,
  STORE_DISTANCE: `.cx-store-distance`,
  MINI_CART_BUTTON: `cx-mini-cart a`,
  PROCEED_TO_CHECKOUT_BUTTON: `cx-cart-proceed-to-checkout button.btn-primary`,
  CHECKOUT_ADDRESS_FORM_SUBMIT_BUTTON: `.cx-address-form-btns button[type="submit"]`,
  CHECKOUT_DELIVERY_MODE_CONTINUE_BUTTON: `cx-delivery-mode .cx-checkout-btns button.btn-primary`,
  CHECKOUT_PAYMENT_FORM_CONTINUE_BUTTON: `cx-payment-form .cx-checkout-btns button.btn-primary`,
  PRODUCT_PAGE_TEMPLATE: `.ProductDetailsPageTemplate`,
  ...CHECKOUT_PAYMENT_FORM_LOCATORS,
  ...CHECKOUT_ADDRESS_FORM_LOCATORS,
  ...REVIEW_ORDER_LOCATORS,
};

export const EMAIL_ADDRESS = `${new Date().getTime()}@test.com`;
const PASSWORD = `Password-1234`;

export const register = () => {
  cy.get(LOCATORS.LOGIN_LINK).click();
  cy.get(LOCATORS.REGISTER_BUTTON).click();
  cy.get(LOCATORS.FORM_TITLE).click();
  cy.get(LOCATORS.FORM_TITLE_ENTRY_MR).click();
  cy.get(LOCATORS.FORM_FIRSTNAME).type('Firstname');
  cy.get(LOCATORS.FORM_LASTNAME).type('Lastname');
  cy.get(LOCATORS.FORM_EMAIL).type(EMAIL_ADDRESS);
  cy.get(LOCATORS.FORM_PASSWORD).type(PASSWORD);
  cy.get(LOCATORS.FORM_CONFIRM_PASSWORD).type(PASSWORD);
  cy.get(LOCATORS.FORM_NEWSLETTER).click();
  cy.get(LOCATORS.FORM_TANDC).click();
  cy.get(LOCATORS.SUBMIT_REGISTRATION_FORM).click();
};
export const login = () => {
  cy.get(LOCATORS.LOGIN_LINK).click();
  cy.get(LOCATORS.SIGNIN_USERNAME).type(EMAIL_ADDRESS);
  cy.get(LOCATORS.SIGNIN_PASSWORD).type(PASSWORD);
  cy.get(LOCATORS.SIGN_IN_BUTTON).click();
};

export const defaultPaymentDetails = {
  accountHolderName: 'test user',
  cardNumber: 4111111111111111,
  cardType: { code: 'visa' },
  expiryMonth: '12',
  expiryYear: '2027',
  cvv: '123',
  billingAddress: {
    firstName: 'test',
    lastName: 'test',
    titleCode: 'mr',
    line1: 'test',
    line2: '',
    town: 'test',
    postalCode: 'H4B3L4',
    country: { isocode: 'UK' },
  },
};
export const fillPaymentForm = (payment) => {
  cy.get(LOCATORS.PAYMENT_CARD_TYPE)
    .should('be.visible')
    .type(payment.cardType.code);

  cy.get(LOCATORS.PAYMENT_CARD_TYPE_OPTION).click();

  cy.get(LOCATORS.ACCOUNT_HOLDER_NAME).type(payment.accountHolderName);
  cy.get(LOCATORS.CARD_NUMBER).type(payment.cardNumber);

  cy.get(LOCATORS.CARD_EXPIRY_MONTH).type(payment.expiryMonth).click();
  cy.get(LOCATORS.CARD_EXPIRY_MONTH_OPTION).click();

  cy.get(LOCATORS.CARD_EXPIRY_YEAR).type(payment.expiryYear).click();
  cy.get(LOCATORS.CARD_EXPIRY_YEAR_OPTION).click();

  cy.get(LOCATORS.CARD_CVV).type(payment.cvv);
};

export const defaultAddress = {
  defaultAddress: false,
  firstName: 'Cypress',
  lastName: 'Customer',
  line1: '10 Fifth Avenue',
  city: 'New York',
  postal: '10001',
  phone: '917-123-0000',
};

export const fillAddressForm = (address: typeof defaultAddress) => {
  cy.get(LOCATORS.ADDRESS_FORM_COUNTRY).click();
  cy.get(LOCATORS.ADDRESS_FORM_COUNTRY_OPTION).last().click();
  cy.get(LOCATORS.ADDRESS_FORM_TITLE).click();
  cy.get(LOCATORS.ADDRESS_FORM_TITLE_OPTION).last().click();
  cy.get(LOCATORS.ADDRESS_FORM_FIRST_NAME).type(address.firstName);
  cy.get(LOCATORS.ADDRESS_FORM_LAST_NAME).type(address.lastName);
  cy.get(LOCATORS.ADDRESS_FORM_LINE_1).type(address.line1);
  cy.get(LOCATORS.ADDRESS_FORM_TOWN).type(address.city);
  cy.get(LOCATORS.ADDRESS_FORM_POSTAL_CODE).type(address.postal);
};
