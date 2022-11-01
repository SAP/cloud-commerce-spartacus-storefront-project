import { OccConfig } from '@spartacus/core';

export const defaultOccCustomerTicketingConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        getTicket: 'users/${customerId}/tickets/${ticketId}',
        createTicketEvent: 'users/${customerId}/tickets/${ticketId}/events',
        getTicketCategories: '/ticketCategories',
        getTicketAssociatedObjects:
          'users/${customerId}/ticketAssociatedObjects',
        createTicket: 'users/${customerId}/tickets',
        uploadAttachment:
          '/users/${customerId}/tickets/${ticketId}/events/${eventCode}/attachments',
        downloadAttachment:
          '/users/${customerId}/tickets/${ticketId}/events/${eventCode}/attachments/${attachmentId}',
      },
    },
  },
};
