import { OccEndpoint } from '@spartacus/core';

declare module '@spartacus/core' {
  interface OccEndpoints {
    /**
     * Endpoint to get ticket details by ticket id
     *
     * * @member {string}
     */
    getTicket?: string | OccEndpoint;

    /**
     * Endpoint to create a ticket event
     *
     * * @member {string}
     */
    createTicketEvent?: string | OccEndpoint;
    /**
     * Endpoint to get ticket categories
     *
     * * @member {string}
     */
    getTicketCategories?: string | OccEndpoint;
    /**
     * Endpoint to get ticket associated objects
     *
     * * @member {string}
     */
    getTicketAssociatedObjects?: string | OccEndpoint;

    /**
     * Endpoint to upload an attachment
     *
     * * @member {string}
     */
    uploadAttachment?: string | OccEndpoint;

    /**
     * Endpoint to create ticket
     *
     * * @member {string}
     */
    createTicket?: string | OccEndpoint;
  }
}
