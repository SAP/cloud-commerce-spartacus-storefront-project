context('Homepage', () => {
  before(() => {
    cy.visit('/');
  });

  it('should display title', () => {
    cy.title().should('not.be.empty');
  });

  it('should have site logo', () => {
    cy.get('cx-page-slot.SiteLogo').should('be.visible');
  });

  it('should have splash banner', () => {
    cy.get('cx-page-slot.Section1 cx-banner');
  });

  it('should have footer with footer navigation and notice', () => {
    cy.get('cx-page-slot.Footer').within(() => {
      cy.get('.navigation-elements').should('have.length', 3);
      cy.get('h1').should('have.length', 3);
      cy.get('cx-generic-link');
      cy.get('.notice').should(
        'contain',
        'SAP SE or an SAP affiliate company. All rights reserved.'
      );
    });
  });
});
