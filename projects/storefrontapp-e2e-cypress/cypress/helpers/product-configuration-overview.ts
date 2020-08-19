import Chainable = Cypress.Chainable;

const continueToCartButtonSelector = 'cx-config-add-to-cart-button button';
const resolveIssuesLinkSelector =
  'cx-configure-cart-entry button.cx-action-link';

/**
 * Navigates to the configured product overview page.
 *
 * @param configuratorType - Configuration type
 * @param productId - Product ID
 * @return {Chainable<Window>} - New configuration overview window
 */
export function goToConfigOverviewPage(
  configuratorType,
  productId
): Chainable<Window> {
  return cy
    .visit(
      `/electronics-spa/en/USD/configureOverview${configuratorType}/product/entityKey/${productId}`
    )
    .then(() => {
      cy.get('.VariantConfigurationOverviewTemplate').should('be.visible');
      this.isConfigOverviewPageDisplayed();
    });
}

/**
 * Verifies whether the product overview page is displayed.
 *
 * @return - 'True' if the configuration overview page is visible, otherwise 'false'
 */
export function isConfigOverviewPageDisplayed() {
  cy.get('cx-config-overview-form').should('be.visible');
}

/**
 * Navigates to the configuration page via configuration tab.
 */
export function navigateToConfigurationPage(): void {
  cy.get('cx-config-tab-bar div div:first a').click({
    force: true,
  });
}

/**
 * Clicks on 'Continue to cart' on the product overview page.
 */
export function clickContinueToCartBtnOnOP(): void {
  cy.get(continueToCartButtonSelector)
    .click()
    .then(() => {
      cy.get('h1').contains('Your Shopping Cart').should('be.visible');
      cy.get('cx-cart-details').should('be.visible');
    });
}

/**
 * Clicks on 'Resolve Issues' link on the product overview page.
 */
export function clickOnResolveIssuesLinkOnOP(): void {
  cy.get(resolveIssuesLinkSelector)
    .click()
    .then(() => {
      this.isConfigPageDisplayed();
    });
}

/**
 * Verifies whether the issues banner is displayed.
 *
 * @param element - HTML element
 * @param {number} numberOfIssues - Expected number of conflicts
 */
export function checkNotificationBannerOnOP(
  element,
  numberOfIssues?: number
): void {
  const resolveIssuesText =
    'issues must be resolved before checkout.  Resolve Issues';
  element
    .get('.cx-error-msg-container')
    .first()
    .invoke('text')
    .then((text) => {
      expect(text).contains(resolveIssuesText);
      const issues = text.replace(resolveIssuesText, '').trim();
      expect(issues).match(/^[0-9]/);
      expect(issues).eq(numberOfIssues.toString());
    });
}

/**
 * Verifies whether the issues banner is displayed and the number of issues are accurate.
 *
 * @param {number} numberOfIssues - Expected number of issues
 * @return - HTML element of 'cx-configure-issues-notification' component, if it is visible.
 * Otherwise verifies if this element is not visible.
 */
export function verifyNotificationBannerOnOP(numberOfIssues?: number) {
  const element = cy.get('cx-configure-issues-notification');
  if (numberOfIssues) {
    this.checkNotificationBannerOnOP(element, numberOfIssues);
  } else {
    element.should('not.be.visible');
  }
}
