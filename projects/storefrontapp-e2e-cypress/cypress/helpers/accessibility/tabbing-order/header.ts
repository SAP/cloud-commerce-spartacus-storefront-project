import { checkAllElements, TabElement } from '../tabbing-order';

export function headerDesktopTabbingOrder(config: TabElement[]) {
  cy.visit('/');
  // Ensures carousel products are loaded before running checks
  cy.get('cx-navigation-ui').should('be.visible');
  cy.get('header cx-site-context-selector select')
    .first()
    .focus();

  checkAllElements(config);
}
