/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { clickHamburger } from '../checkout-flow';
import { loginRegisteredUser as login } from "../cart";
import { myCompanyAdminUser } from '../../sample-data/shared-users';

const HTTP_STATUS_OK = 200;
const FIRST_ROW = 1;
const ID_COLUMN = 0;
const SUBJECT_COLUMN = 1;
const CATEGORY_COLUMN = 2;
const STATUS_COLUMN = 5;
const ID_DELIMITER = 11;
const SUBJECT_DELIMITER = 10;
const STATUS_DELIMITER = 9;

const CUSTOMER_SUPPORT_MENU_OPTION_INDEX = 14;
const FIRST_TICKET_COLUMN_INDEX = 1;
const FIRST_TICKET_ROW_INDEX = 1;
const SECOND_TICKET_ROW_INDEX = 2;

export enum TestCategory {
  enquiry = "Enquiry",
  complaint = "Complaint",
  problem = "Problem",
}

export interface TestTicketDetails {
  subject: string;
  message: string;
  category: TestCategory;
  id?: string;
  associatedTo?: string;
  filename?: string;
  status?: string;
}

export function loginRegisteredUser() {
  login();
}

export function loginAsLindaWolf() {
  cy.requireLoggedIn(myCompanyAdminUser);
  cy.reload();
}

// export function visitHomePage(){
//   cy.visit('/');
//   cy.get('#cx-header', { timeout: 10000 }).should('be.visible');
// }

export function clickMyAccountMenuOption(){
  cy.onMobile(() => {
    clickHamburger();
  });
  cy.get('.accNavComponent button').click();
}

export function clickCustomerSupportMenuOption(){
  cy.get(`.accNavComponent li:nth-child(${CUSTOMER_SUPPORT_MENU_OPTION_INDEX})`).should('contain.text', 'Customer Service');
  cy.get(`.accNavComponent li:nth-child(${CUSTOMER_SUPPORT_MENU_OPTION_INDEX}) a`).click();
}

export function verifyTicketListingPageVisit(){
  cy.url().should('include','/my-account/support-tickets');
  cy.get('cx-customer-ticketing-list').should('exist');
}

export function clickFirstTicketFromTicketListing(){
  cy.get(`#ticketing-list-table tbody tr:nth-child(${FIRST_TICKET_ROW_INDEX}) .cx-ticketing-list-data:nth-child(${FIRST_TICKET_COLUMN_INDEX}) a.cx-ticketing-list-value`).click();
}

export function clickSecondTicketFromTicketListing(){
  cy.get(`#ticketing-list-table tbody tr:nth-child(${SECOND_TICKET_ROW_INDEX}) .cx-ticketing-list-data:nth-child(${FIRST_TICKET_COLUMN_INDEX}) a.cx-ticketing-list-value`).click();
}

export function verifyTicketDetailsPageVisit(){
  cy.url().should('match',/http:\/\/.+\/my\-account\/support\-ticket\/[0-9]+/);
  cy.get('cx-customer-ticketing-messages').should('exist');
}

export function visitPage(page: string, alias?: string){
  cy.intercept(page).as(alias? alias : page);
  cy.visit(page);
  cy.wait(`@${alias? alias : page}`).its('response.statusCode').should('eq', HTTP_STATUS_OK);
}

export function visitElectronicTicketListingPage() {
  visitPage('/my-account/support-tickets', 'ticketListingPage');
}


export function openCreateTicketPopup() {
  cy.get('cx-customer-ticketing-list').should('exist');
  cy.get('cx-customer-ticketing-create button').click();
  cy.get('cx-customer-ticketing-create-dialog').should('exist');
}

export function fillTicketDetails(ticketDetails: TestTicketDetails){
  const CATEGORY_SELECT = 0;

  cy.get('cx-customer-ticketing-create-dialog').within(() => {
    cy.get('.cx-customer-ticket-form-container').should('contain', 'Add New Request');
    cy.get('textarea').first().type(ticketDetails.subject);
    cy.contains('.cx-customer-ticket-label', 'Category').get('select').eq(CATEGORY_SELECT).select(ticketDetails.category);
    cy.get('textarea').last().type(ticketDetails.message);
    cy.get('cx-form-errors').should('not.be.visible');
  });
}

export function addFile(filename: string){
  cy.get('cx-file-upload input[type="file"]').attachFile({filePath: '../helpers/customer-ticketing/files-to-upload/' + filename}, { allowEmpty: true });
  cy.get('p').contains(filename);
}

export function verifyFileAttachedToMessage(filename: string){
  cy.get('cx-messaging').contains(filename);
}

export function clickSubmit(){
  cy.contains('[type="button"]', 'Submit').click();
}

export function verifyRequestCompleted(){
  cy.get('cx-global-message').contains('Request Created');
}

export function clickCancel(){
  cy.contains('[type="button"]', 'Cancel').click();
}

export function clickClose(){
  cy.get('cx-customer-ticketing-create-dialog').within(() => {
    cy.get('.cx-customer-ticket-form-container').should('contain', 'Add New Request');
    cy.get('button[aria-label="Close"]').click();
  });
}

export function verifyFileTooLargeErrorIsShown(){
  cy.get('cx-form-errors').should('be.visible');
  cy.get('cx-form-errors').get('p').contains('File size should not exceed 10 MB');

}

export function verifyCreatedTicketDetails(ticketDetails: TestTicketDetails) {
   const row = cy.get('cx-customer-ticketing-list').get('tbody').get('tr').eq(FIRST_ROW);
   row.get('td').eq(SUBJECT_COLUMN).contains(ticketDetails.subject);
   row.get('td').eq(CATEGORY_COLUMN).contains(ticketDetails.category);
   row.get('td').eq(STATUS_COLUMN).contains("Open");

   row.click();
   cy.get('cx-messaging').contains(ticketDetails.message);
}

export function verifyFieldValidationErrorShown(){
  cy.get('cx-form-errors').should('be.visible');
}


export function verifyTicketDoesNotExist(ticketDetails: TestTicketDetails) {
  cy.get('cx-customer-ticketing-list').then( ticketListingElement => {
    if(ticketListingElement.find('tbody').length > 0) {
      cy.get('cx-customer-ticketing-list').get('tbody').get('tr').eq(FIRST_ROW).get('td').eq(SUBJECT_COLUMN).should('not.contain', ticketDetails.subject);
    }
    else {
      cy.get('cx-customer-ticketing-list').find('h3').contains("You don't have any request");
    }
  });
}

export function visitApparelUKTicketListingPage(){
  visitPage('apparel-uk-spa/en/GBP/my-account/support-tickets', 'apparelTicketListingPage');
}

export function extractTicketDetailsFromFirstRowInTicketListingPage(): TestTicketDetails {
  let testTicketDetails: TestTicketDetails = {
    subject: "Temp",
    message: "Temp",
    category: TestCategory.complaint,
    id: "000000",
    status: "Open"
  };

  const row = cy.get('cx-customer-ticketing-list').find('tbody').get('tr').eq(FIRST_ROW);
  row.get('td').eq(ID_COLUMN).invoke('text').then((x) => {
    x = x.substring(ID_DELIMITER);
    testTicketDetails.id = x.toString();
  });
  row.get('td').eq(SUBJECT_COLUMN).invoke('text').then((x) => {
    x = x.substring(SUBJECT_DELIMITER);
    testTicketDetails.subject = x.toString();
  });
  row.get('td').eq(STATUS_COLUMN).invoke('text').then((x) => {
    x = x.substring(STATUS_DELIMITER);
    testTicketDetails.status = x.toString();
  });

  return testTicketDetails;
}

export function verifyTicketDetailsByComparingTicketHeaderToExtractedDetails(ticketDetails: TestTicketDetails){
  //assert title when available

  cy.get('.cx-card-label').eq(0).then((x) => cy.wrap(x).should('include.text', ticketDetails.id));
  cy.get('.cx-card-label').eq(3).then((x) => cy.wrap(x).should('include.text', ticketDetails.status));
}

export function createNewTicket(){
  const testTicketDetails: TestTicketDetails = {
    subject: 'Entering a subject',
    message: 'Typing a message',
    category: TestCategory.complaint,
  };

  visitElectronicTicketListingPage();
  openCreateTicketPopup();
  fillTicketDetails(testTicketDetails);
  clickSubmit();
  verifyCreatedTicketDetails(testTicketDetails);
}

export function verifyTicketStatusIsOpenInTicketDetailsPage(){
  cy.get('.cx-card-label').eq(3).contains("Open");
}

export function verifyTicketStatusIsClosedInTicketDetailsPage(){
  cy.get('.cx-card-label').eq(3).contains("Closed");
}

export function closeTicket(){
  cy.get('.btn.btn-block.btn-action').click();
  cy.get('.cx-customer-ticket-form-body').should('exist');
  cy.get('label > .form-control').last().type("Closing Ticket");
  cy.get('.cx-customer-ticket-form-footer > .btn-primary').click();
}

export function verifyTicketStatusIsOpenOnListingPage(){
  const row = cy.get('cx-customer-ticketing-list').find('tbody').get('tr').eq(1);
  row.get('td').eq(5).contains(" Open ");
}

export function verifyTicketStatusIsClosedOnListingPage(){
  const row = cy.get('cx-customer-ticketing-list').find('tbody').get('tr').eq(1);
  row.get('td').eq(5).contains(" Closed ");
}

export function verifyMessageBoxExists(doesExist){
  if(doesExist){
    cy.get('.form-control').should('exist');
  } else {
    cy.get('.form-control').should('not.exist');
  }
}

export function reopenTicket(){
  cy.get('.btn.btn-block.btn-action"').click();
  cy.get('.cx-customer-ticket-form-body').should('exist');
  cy.get('label > .form-control').last().type("Reopening Ticket");
  cy.get('.cx-customer-ticket-form-footer > .btn-primary').click();
}

export function verifyAllCustomerMessagesAreBeingPopulatedInChatHistory(){
  verifyLastMessageWasPosted();
}

export function clickSend(){
  cy.get('.cx-send').click();
}

export function postMessageAsCustomerIntoChatBox(){
  cy.get('.form-control').type("Update ticket with comments");
}

export function verifyLastMessageWasPosted(){
  let count_of_message_after_post = 2;
  cy.get(".cx-message-left-align-text", {timeout: 100000}).should('have.length', count_of_message_after_post);
  cy.get(".cx-message-left-align-text").eq(count_of_message_after_post-1).contains("Update ticket with comments");
}

export function navigateBackToPreviousPage(){
  cy.go('back');
}
