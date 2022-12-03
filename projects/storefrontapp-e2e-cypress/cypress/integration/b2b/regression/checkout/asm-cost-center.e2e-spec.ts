import * as b2bCheckout from '../../../../helpers/b2b/b2b-checkout';
import * as asm from '../../../../helpers/asm';
import * as alerts from '../../../../helpers/global-message';
import { POWERTOOLS_BASESITE } from '../../../../sample-data/b2b-checkout';
import { AsmConfig } from '@spartacus/storefront';
import * as checkout from '../../../../helpers/checkout-flow';

context('B2B - ASM Account Checkout', () => {
  const user_email = 'william.hunter@pronto-hw.com';
  const invalid_cost_center = 'Rustic_Global';
  const valid_cost_center = 'Pronto_Services';

  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
    Cypress.env('BASE_SITE', POWERTOOLS_BASESITE);
  });

  beforeEach(() => {
    cy.cxConfig({
      asm: { agentSessionTimer: { startingDelayInSeconds: 10000 } },
    } as AsmConfig);
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should show error on invalid cost center', () => {
    cy.log('--> Agent logging in');
    checkout.visitHomePage('asm=true');
    cy.get('cx-asm-main-ui').should('exist');
    cy.get('cx-asm-main-ui').should('be.visible');
    asm.agentLogin();

    cy.log('--> customer emulation');
    cy.get('cx-csagent-login-form').should('not.exist');
    cy.get('cx-customer-selection').should('exist');
    cy.get('cx-customer-selection form').within(() => {
      cy.get('[formcontrolname="searchTerm"]')
        .should('not.be.disabled')
        .type(user_email);
      cy.get('[formcontrolname="searchTerm"]').should('have.value', user_email);
    });
    cy.wait(asm.listenForCustomerSearchRequest())
      .its('response.statusCode')
      .should('eq', 200);
    cy.get('cx-customer-selection div.asm-results button').click();
    cy.get('cx-customer-selection button[type="submit"]').click();

    cy.log('--> should show error on invalid cost center');
    b2bCheckout.addB2bProductToCartAndCheckout();
    cy.get('cx-payment-type').within(() => {
      cy.findByText('Account').click({ force: true });
    });
    cy.get('button.btn-primary').should('be.enabled').click({ force: true });
    cy.intercept('PUT', '*costcenter?costCenterId=*').as('costCenterReq');

    cy.get('cx-cost-center').within(() => {
      cy.get('select').select(invalid_cost_center);
    });

    cy.wait('@costCenterReq').its('response.statusCode').should('eq', 400);
    alerts.getErrorAlert().contains('Invalid cost center.');

    cy.log('--> should not show error on valid cost cente');
    alerts.getErrorAlert().then((alert) => {
      cy.wrap(alert).within(() => {
        cy.get('button').click();
      });
    });
    // flaky:  added timer between intercepters
    cy.wait(1000);
    cy.intercept('PUT', '*costcenter?costCenterId=*').as('costCenterReqValid');
    cy.get('cx-cost-center').within(() => {
      cy.get('select').select(valid_cost_center);
    });
    cy.wait('@costCenterReqValid').its('response.statusCode').should('eq', 200);
    alerts.getErrorAlert().should('not.exist');

    cy.log('--> sign out');
    asm.agentSignOut();
  });
});
