import { viewportContext } from '../../../helpers/viewport-context';
import * as customerTicketing from '../../../helpers/customer-ticketing/customer-ticketing';
import {
  TestTicketDetails,
  TestCategory,
  TestStatus,
  FIRST_ROW_TICKET_LIST,
} from '../../../helpers/customer-ticketing/customer-ticketing';


describe('ticket details', () => {
  viewportContext(['desktop', 'mobile'], () => {
    context('Registered User', () => {
      before(() => {
        cy.window().then((win) => {
          win.sessionStorage.clear();
        });
      });
      it('should be able to view ticket details page for an existing ticket', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.clickMyAccountMenuOption();
        customerTicketing.clickCustomerSupportMenuOption();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket({
          subject: 'ticket details',
          message: 'ticket details',
          category: customerTicketing.TestCategory.complaint,
        });
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyTicketDetailsPageVisit();
      });

      it('clicking a ticket should open its corresponding ticket details', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.clickMyAccountMenuOption();
        customerTicketing.clickCustomerSupportMenuOption();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket({
          subject: 'First ticket',
          message: 'First ticket',
          category: TestCategory.complaint,
        });
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket({
          subject: 'Second ticket',
          message: 'Second ticket',
          category: TestCategory.complaint,
        });
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.verifyTicketListingPageVisit();
        let ticketDetails = customerTicketing.extractTicketDetailsFromFirstRowInTicketListingPage();
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyTicketDetailsAreDisplayedInTicketHeader(ticketDetails);
      });

      it('closing a ticket should not let user interact with the ticket anymore', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket({
          subject: 'First ticket',
          message: 'First ticket',
          category: TestCategory.complaint,
        });
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyTicketDetailsPageVisit();
        customerTicketing.verifyStatusOfTicketInDetailsPage(TestStatus.open);
        customerTicketing.closeTicketRequest("Closing ticket");
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.verifyStatusOfTicketInList();
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyMessageBoxIsDisabled();
      });

      it('reopening a ticket should let user make more interaction with the ticket', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.createTicket({
          subject: 'First ticket',
          message: 'First ticket',
          category: TestCategory.complaint,
        });
        customerTicketing.clickTicketInRow();
        customerTicketing.closeTicketRequest("Closing ticket");
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.verifyStatusOfTicketInList();
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyStatusOfTicketInDetailsPage(TestStatus.closed);
        customerTicketing.reopenTicketRequest("Reopening ticket");
        customerTicketing.verifyStatusOfTicketInDetailsPage(TestStatus.in_process);
        customerTicketing.verifyMessageBoxIsEnabled();
      });


      it('ticket should always have atleast one message in it', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Ticket should always have atleast one message',
          message: 'Ticket should always have atleast one message',
          category: TestCategory.complaint,
          filename: 'fileNotSupported.xls',
        };
        customerTicketing.sendMessage("Update ticket with comments");
        customerTicketing.verifyMessageWasPosted("Update ticket with comments");
        customerTicketing.navigateBackToPreviousPage();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.createTicket(testTicketDetails);
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyTicketDetailsPageVisit();
        customerTicketing.verifyMessageWasPosted("Update ticket with comments");
      });

      it('pressing send should publish message without attachment', () => {
        customerTicketing.verifyTicketDetailsPageVisit();
        customerTicketing.sendMessage("Update ticket with comments");
        customerTicketing.verifyMessageWasPosted("Update ticket with comments");
      });

      it('pressing send should publish message with attachment', () => {
        let file_name = "test.docx";
        customerTicketing.verifyTicketDetailsPageVisit();
        customerTicketing.addFile(file_name);
        customerTicketing.sendMessage("Update ticket with comments");
        customerTicketing.verifyMessageWasPosted("Update ticket with comments");
        customerTicketing.verifyFileAttachedToMessage(file_name);
      });

      it('should be able to view ticket details page for an existing ticket', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'A test subject',
          message: 'A test message',
          category: TestCategory.complaint,
        };
        customerTicketing.createTicket(testTicketDetails);
        customerTicketing.clickMyAccountMenuOption();
        customerTicketing.clickCustomerSupportMenuOption();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
        customerTicketing.verifyTicketDetailsPageVisit();
      });
      it('should be able to visit ticket details page for an existing ticket via url', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'A test subject',
          message: 'A test message',
          category: TestCategory.complaint,
        };
        customerTicketing.createTicket(testTicketDetails);
        customerTicketing.clickMyAccountMenuOption();
        customerTicketing.clickCustomerSupportMenuOption();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.clickTicketInRow(FIRST_ROW_TICKET_LIST);
      });
      it('should throw 404 error when trying to visit ticket details page for a non-existing ticket id via url', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitTicketDetailsPageForNonExistingTicket();
        customerTicketing.verifyTicketListingPageVisit();
        customerTicketing.verifyGlobalMessage("Ticket not found.");
      });
    });
  });
});
