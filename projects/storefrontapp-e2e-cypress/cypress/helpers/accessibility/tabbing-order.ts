import { TabbingOrderTypes } from './tabbing-order.config';
import { waitForPage } from '../checkout-flow';
import { loginUser } from '../login';
import { register as authRegister } from '../auth-forms';
import { user } from '../../sample-data/checkout-flow';

export interface TabElement {
  value?: string;
  type: TabbingOrderTypes;
}

export const testProductUrl = '/product/779841';

export function checkElement(tabElement: TabElement) {
  // Check generic cases without value
  switch (tabElement.type) {
    case TabbingOrderTypes.GENERIC_CHECKBOX: {
      cy.focused().should('have.attr', 'type', 'checkbox');
      return;
    }
    case TabbingOrderTypes.GENERIC_BUTTON: {
      cy.focused().should('have.attr', 'type', 'button');
      return;
    }
    case TabbingOrderTypes.GENERIC_INPUT: {
      cy.focused()
        .should('have.prop', 'tagName')
        .should('eq', 'INPUT');
      break;
    }
    case TabbingOrderTypes.GENERIC_NG_SELECT: {
      cy.focused().should('have.attr', 'type', 'ng-select');
      return;
    }
    case TabbingOrderTypes.CX_PRODUCT_VIEW: {
      cy.focused()
        .should('have.prop', 'tagName')
        .should('eq', 'DIV');
      cy.focused().should('have.class', 'cx-product-layout');
      break;
    }
  }

  // Check non-generic cases requiring value
  if (!(tabElement.value && tabElement.value.length)) {
    return;
  }

  switch (tabElement.type) {
    case TabbingOrderTypes.FORM_FIELD: {
      cy.focused().should('have.attr', 'formcontrolname', tabElement.value);
      break;
    }
    case TabbingOrderTypes.LINK: {
      cy.focused().should('contain', tabElement.value);
      break;
    }
    case TabbingOrderTypes.BUTTON: {
      cy.focused().should('contain', tabElement.value);
      break;
    }
    case TabbingOrderTypes.NG_SELECT: {
      cy.focused()
        .parentsUntil('ng-select')
        .last()
        .parent()
        .should('have.attr', 'formcontrolname', tabElement.value);
      break;
    }
    case TabbingOrderTypes.CHECKBOX_WITH_LABEL: {
      cy.focused()
        .parent()
        .should('contain', tabElement.value);
      break;
    }
    case TabbingOrderTypes.IMG_LINK: {
      cy.focused().should('have.attr', 'href', tabElement.value);
      break;
    }
    case TabbingOrderTypes.ITEM_COUNTER: {
      cy.focused()
        .parentsUntil('cx-item-counter')
        .last()
        .parent()
        .should('have.attr', 'formcontrolname', tabElement.value);
      break;
    }
    case TabbingOrderTypes.RADIO: {
      cy.focused()
        .should('have.attr', 'type', 'radio')
        .should('have.attr', 'formcontrolname', tabElement.value);
      break;
    }
    case TabbingOrderTypes.H3: {
      cy.focused()
        .get('h3')
        .should('contain', tabElement.value);
      return;
    }
    case TabbingOrderTypes.CX_MEDIA: {
      cy.focused()
        .find('img')
        .should('have.attr', 'alt', tabElement.value);
      return;
    }
    case TabbingOrderTypes.SELECT: {
      cy.focused()
        .get('select')
        .parent()
        .should('contain', tabElement.value);
      break;
    }
    case TabbingOrderTypes.NAV_CATEGORY_DROPDOWN: {
      cy.focused()
        .parent()
        .contains(tabElement.value);
      break;
    }
    case TabbingOrderTypes.LI_LINK: {
      cy.focused()
        .should('have.prop', 'LI')
        .contains(tabElement.value);
      break;
    }
  }
}

export function checkAllElements(tabElements: TabElement[]) {
  tabElements.forEach((element: TabElement, index: number) => {
    // skip tabbing on first element
    if (index !== 0) {
      cy.tab();
    }

    checkElement(element);
  });
}

export function getFormFieldByValue(value: string) {
  return cy.get(`[formcontrolname="${value}"]`);
}

export function register() {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.visit('/login/register');
  authRegister(user);
  cy.wait(`@${loginPage}`);
}

export function login() {
  const homePage = waitForPage('homepage', 'getHomePage');
  cy.visit('/login');
  loginUser();
  cy.wait(`@${homePage}`);
}

export function registerAndLogin(): void {
  const loginPage = waitForPage('/login', 'getLoginPage');
  const homePage = waitForPage('homepage', 'getHomePage');
  cy.visit('/login/register');
  authRegister(user);
  cy.wait(`@${loginPage}`);
  loginUser();
  cy.wait(`@${homePage}`);
}

export function addProduct(): void {
  const cartPage = waitForPage('/cart', 'getCartPage');

  cy.visit(testProductUrl);
  cy.getAllByText(/Add to cart/i)
    .first()
    .click();
  cy.get('cx-added-to-cart-dialog').within(() => {
    cy.getAllByText(/View cart/i)
      .first()
      .click();
  });
  cy.wait(`@${cartPage}`);
}

export function checkoutNextStep(url: string) {
  const nextStep = waitForPage(url, 'getNextStep');
  cy.getAllByText('Continue')
    .first()
    .click();
  cy.wait(`@${nextStep}`);
}
