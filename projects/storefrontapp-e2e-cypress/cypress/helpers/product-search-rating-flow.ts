import { PRODUCT_LISTING } from './data-configuration';

export const resultsTitle = 'cx-breadcrumb h1';
export const tabsHeaderList = 'cx-product-tabs .details > h3';

export function productRatingFlow(mobile?: string) {
  // Search for a product
  cy.get('cx-searchbox input').type('DSC-N1{enter}');

  cy.get(resultsTitle).should('contain', '21 results for "DSC-N1"');

  cy.get('cx-product-list-item').should(
    'have.length',
    PRODUCT_LISTING.PRODUCTS_PER_PAGE
  );

  cy.get('cx-product-list-item')
    .first()
    .should('contain', 'Li-Ion f Series G');

  // Navigate to next page
  cy.get('.page-item:last-of-type .page-link:first').click();
  cy.get('.page-item.active > .page-link').should('contain', '2');

  cy.get('cx-product-list-item:nth-child(1)').should('contain', 'DSC-WX1');

  // Sort by top rated
  cy.get('cx-sorting .ng-select:first').ngSelect(
    PRODUCT_LISTING.SORTING_TYPES.BY_TOP_RATED
  );
  cy.get('.page-item.active > .page-link').should('contain', '2');
  cy.get('cx-product-list-item:first').should('contain', 'DSC-WX1');

  // Navigate to previous page
  cy.get('.page-item:first-of-type .page-link:first').click();
  cy.get('.page-item.active > .page-link').should('contain', '1');

  cy.get('cx-product-list-item:nth-child(1)').should(
    'contain',
    'Cyber-shot DSC-W55'
  );

  // Filter by category
  cy.get('.cx-facet-header')
    .contains('Category')
    .parents('.cx-facet-group')
    .within(() => {
      cy.get('.cx-facet-checkbox')
        .first()
        .click({ force: true });
    });

  cy.get(resultsTitle).should('contain', '20 results for "DSC-N1"');
  cy.get('cx-product-list-item:first')
    .first()
    .should('contain', 'Cyber-shot DSC-W55');

  if (mobile) {
    cy.get(
      `cx-product-facet-navigation ${mobile} .cx-facet-filter-pill .close:first`
    ).click();
  } else {
    cy.get(
      'cx-product-facet-navigation .cx-facet-filter-pill .close:first'
    ).click();
  }

  cy.get(resultsTitle).should('contain', '21 results for "DSC-N1"');

  // Select product and read all the tabs on product details page
  cy.get('cx-product-list-item:first .cx-product-name').click();
  cy.get(tabsHeaderList)
    .eq(0)
    .should('contain', 'Product Details');
  cy.get(tabsHeaderList)
    .eq(1)
    .should('contain', 'Specs');
  cy.get(tabsHeaderList)
    .eq(2)
    .should('contain', 'Reviews');
  cy.get(tabsHeaderList)
    .eq(3)
    .should('contain', 'Shipping');
}
