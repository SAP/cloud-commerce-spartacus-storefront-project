import { viewportContext } from "../../../helpers/viewport-context";
import * as customerTicketing from '../../../helpers/customer-ticketing/customer-ticketing';
import {TestTicketDetails, TestCategory} from '../../../helpers/customer-ticketing/customer-ticketing';



describe('ticketing', () => {
  viewportContext(['desktop', 'mobile'], () => {
    context('Registered User', () => {
      before(() => {
        cy.window().then((win) => {
          win.sessionStorage.clear();
        });
      });

      it('should open create new ticket popup when clicking add button', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
      });

      it('should be able to create ticket when filling the required form', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Entering a subject',
          message: 'Typing a message',
          category: TestCategory.complaint,
        };

        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickSubmit();
        customerTicketing.verifyGlobalMessage();
        customerTicketing.verifyCreatedTicketDetails(testTicketDetails);

      });

      it('should be able to create a ticket with an attachment', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Testing uploading attachment',
          message: 'Has the file been uploaded',
          category: TestCategory.complaint,
          filename: 'test.docx',
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.addFile(testTicketDetails.filename);
        customerTicketing.clickSubmit();
        customerTicketing.verifyGlobalMessage();
        customerTicketing.verifyCreatedTicketDetails(testTicketDetails);
        customerTicketing.verifyFileAttachedToMessage(testTicketDetails.filename);
      });

      it('should not be able to create a ticket with an attachment larger than 10mb', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Testing uploading attachment',
          message: 'Has the file been uploaded',
          category: TestCategory.complaint,
          filename: 'largeFile.txt',
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.addFile(testTicketDetails.filename);
        customerTicketing.clickSubmit();
        customerTicketing.verifyTicketDoesNotExist(testTicketDetails);
      });

      it('should not be able to create a ticket with an attachment that has an unsupported extension', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Testing uploading attachment',
          message: 'Has the file been uploaded',
          category: TestCategory.complaint,
          filename: 'fileNotSupported.xls',
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.addFile(testTicketDetails.filename);
        customerTicketing.clickSubmit();
        customerTicketing.verifyTicketDoesNotExist(testTicketDetails); // TODO check if any error is shown
      });

      it('should be able to create a ticket with an empty attachment', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Testing uploading attachment',
          message: 'Has the file been uploaded',
          category: TestCategory.complaint,
          filename: 'emptyFile.doc',
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.addFile(testTicketDetails.filename);
        customerTicketing.clickSubmit();
        customerTicketing.verifyGlobalMessage();
        customerTicketing.verifyCreatedTicketDetails(testTicketDetails);
        customerTicketing.verifyFileAttachedToMessage(testTicketDetails.filename);
      });

      it('should not be able to see created ticket in other stores', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Entering a subject',
          message: 'Typing a message',
          category: TestCategory.complaint,
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickSubmit();
        customerTicketing.verifyGlobalMessage();
        customerTicketing.verifyCreatedTicketDetails(testTicketDetails);
        customerTicketing.visitApparelUKTicketListingPage();
        customerTicketing.verifyTicketDoesNotExist(testTicketDetails);
      });

      it('should not allow ticket to be created if form not properly completed', () => {
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.clickSubmit();
        customerTicketing.verifyFieldValidationErrorShown();
      });

      it('should not create tickets when cancelling or closing the modal', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Cancelling a ticketing creation',
          message: 'Cancelled',
          category: TestCategory.complaint,
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickCancel();
        customerTicketing.verifyTicketDoesNotExist(testTicketDetails);
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickClose();
        customerTicketing.verifyTicketDoesNotExist(testTicketDetails);
      });

      it('should not create ticket if subject exceeds 255 character limit', () => {
        const TICKET_SUBJECT_MAX_LENGTH = 255;
        const testTicketDetails: TestTicketDetails = {
          subject: customerTicketing.generateDummyStringOfLength(TICKET_SUBJECT_MAX_LENGTH+1),
          message: 'Exceeding character limit',
          category: TestCategory.complaint,
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickSubmit();
        customerTicketing.verifyTicketSubjectAndMessageDoNotExceedCharacterLimit();
      });

      it('should not create ticket if message exceeds 5000 character limit', () => {
        const TICKET_MESSAGE_MAX_LENGTH = 5000;
        const testTicketDetails: TestTicketDetails = {
          subject: 'Exceeding character limit',
          message: customerTicketing.generateDummyStringOfLength(TICKET_MESSAGE_MAX_LENGTH+1),
          category: TestCategory.complaint,
        };
        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickSubmit();
        customerTicketing.verifyTicketSubjectAndMessageDoNotExceedCharacterLimit();
      });

      it('should close create ticket popup upon submit', () => {
        const testTicketDetails: TestTicketDetails = {
          subject: 'Entering a subject',
          message: 'Typing a message',
          category: TestCategory.complaint,
        };

        customerTicketing.loginRegisteredUser();
        customerTicketing.visitElectronicTicketListingPage();
        customerTicketing.openCreateTicketPopup();
        customerTicketing.fillTicketDetails(testTicketDetails);
        customerTicketing.clickSubmit();
        customerTicketing.verifyCreateTicketPopupIsClosed();
      });

    });
  });
});
