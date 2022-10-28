/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export const commerceQuotes = {
  commerceQuotes: {
    list: {
      header: 'My Quotes',
      name: 'Name',
      updated: 'Updated',
      sortBy: 'Sort by',
      sortOrders: 'Sort orders',
      empty: 'Quote list is empty',
    },
    states: {
      BUYER_DRAFT: 'Draft',
      BUYER_SUBMITTED: 'Submitted',
      BUYER_ACCEPTED: 'Accepted',
      BUYER_APPROVED: 'Approved',
      BUYER_REJECTED: 'Rejected',
      BUYER_OFFER: 'Vendor Quote',
      BUYER_ORDERED: 'Ordered',
      SELLER_DRAFT: 'Draft',
      SELLER_REQUEST: 'Requested',
      SELLER_SUBMITTED: 'Submitted',
      SELLERAPPROVER_PENDING: 'Pending Approval',
      SELLERAPPROVER_APPROVED: 'Approved',
      SELLERAPPROVER_REJECTED: 'Rejected',
      CANCELLED: 'Cancelled',
      EXPIRED: 'Expired',
    },
    actions: {
      VIEW: 'View Quote',
      SUBMIT: 'Submit Quote',
      SAVE: 'Save Quote',
      EDIT: 'Edit Quote',
      CANCEL: 'Cancel Quote',
      CHECKOUT: 'Accept and Checkout',
      APPROVE: 'Approve Quote',
      REJECT: 'Reject Quote',
      REQUOTE: 'Requote',
    },
    commons: {
      id: 'Quote ID',
      status: 'Status',
      creationSuccess: 'Quote #{{ code }} created successfully',
    },
    details: {
      code: 'Quote ID',
      created: 'Created',
      lastUpdated: 'Last Updated',
      estimatedTotal: 'Estimated Total',
      description: 'Description',
      expiryDate: 'Expiry Date',
    },
    links: {
      newCart: 'New Cart',
      quotes: 'Quotes',
    },
    requestDialog: {
      requestQuote: 'Request a Quote',
      title: 'Request Quote',
      continueToEdit: 'Continue to Edit',
      form: {
        name: {
          label: 'Quote name',
          placeholder: 'Enter name',
        },
        description: {
          label: 'Description (Optional)',
          placeholder: 'Enter description',
        },
        comment: {
          label: 'Add a Comment',
          placeholder: 'Add comment',
        },
        request: 'Request quote',
        continueToEdit: 'Continue to Edit',
        note: 'Please Note:',
        requestSubmitNote:
          'Once a request for quote is submitted it cannot be modified.',
        minRequestInitiationNote:
          'Minimum ${{minValue}} subtotal is required to submit a quote ',
      },
    },
    httpHandlers: {
      threshold: {
        underTresholdError:
          'Requested quote does not meet the threshold of minimum {{minValue}}$.',
      },
    },
  },
};
