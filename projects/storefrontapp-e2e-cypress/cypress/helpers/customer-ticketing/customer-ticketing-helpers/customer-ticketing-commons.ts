/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { clickHamburger } from '../../checkout-flow';
import { loginRegisteredUser as login } from '../../cart';
import { myCompanyAdminUser } from '../../../sample-data/shared-users';

export const HTTP_STATUS_OK = 200;
export const COLUMN_HEADER_TICKET_LIST = 0;
export const FIRST_ROW_TICKET_LIST = 1;
export const SECOND_ROW_TICKET_LIST = 2;
export const FIFTH_ROW_TICKET_LIST = 5;
export const ID_COLUMN = 0;
export const SUBJECT_COLUMN = 1;
export const CATEGORY_COLUMN = 2;
export const CREATED_ON_COLUMN = 3;
export const CHANGED_ON_COLUMN = 4;
export const STATUS_COLUMN = 5;
export const CUSTOMER_SUPPORT_MENU_OPTION_INDEX = 14;
export const MAX_TICKETS_PER_PAGE = 5;
export const LAST_PAGE = "last";

export enum TestSortingTypes {
  byChangedOn = 'Changed On',
  byId = 'ID',
}

export enum TestStatus {
  closed = 'Closed',
  open = 'Open',
}

export enum TestCategory {
  enquiry = 'Enquiry',
  complaint = 'Complaint',
  problem = 'Problem',
}

export interface TestTicketDetails {
  subject: string;
  message: string;
  category: TestCategory;
  associatedTo?: string;
  filename?: string;
}

export function loginRegisteredUser() {
  login();
}

export function loginAsAdmin() {
  cy.requireLoggedIn(myCompanyAdminUser);
  cy.reload();
}

export function visitPage(page: string, alias?: string) {
  cy.intercept(page).as(alias ? alias : page);
  cy.visit(page);
  cy.wait(`@${alias ? alias : page}`)
    .its('response.statusCode')
    .should('eq', HTTP_STATUS_OK);
}

export function visitElectronicTicketListingPage() {
  visitPage('/my-account/support-tickets', 'ticketListingPage');
}

export function verifyGlobalMessage(globalMessage = 'Request created.') {
  cy.get('cx-global-message').contains(globalMessage);
  cy.get('cx-global-message')
    .contains(globalMessage)
    .should('not.exist', { timeout: 10000 });
}

export function visitApparelUKTicketListingPage() {
  visitPage(
    'apparel-uk-spa/en/GBP/my-account/support-tickets',
    'apparelTicketListingPage'
  );
}

export function clickMyAccountMenuOption() {
  cy.visit('/');
  cy.get('#cx-header', { timeout: 10000 }).should('be.visible');
  cy.onMobile(() => {
    clickHamburger();
  });
  cy.get('.accNavComponent button').click();
}

export function clickCustomerSupportMenuOption() {
  cy.get(
    `.accNavComponent li:nth-child(${CUSTOMER_SUPPORT_MENU_OPTION_INDEX})`
  ).should('contain.text', 'Customer Service');
  cy.get(
    `.accNavComponent li:nth-child(${CUSTOMER_SUPPORT_MENU_OPTION_INDEX}) a`
  ).click();
}

export function verifyTicketListingPageVisit() {
  cy.url().should('include', '/my-account/support-tickets');
  cy.get('cx-customer-ticketing-list').should('exist');
}

export function verifyTicketDetailsPageVisit() {
  cy.url().should('match', /http:\/\/.+\/my\-account\/support\-ticket\/[0-9]+/);
  cy.get('cx-customer-ticketing-messages').should('exist');
}
