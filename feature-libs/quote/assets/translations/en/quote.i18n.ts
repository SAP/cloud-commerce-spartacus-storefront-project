/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export const quote = {
  quote: {
    list: {
      name: 'Name',
      updated: 'Updated',
      sortBy: 'Sort by',
      sortOrders: 'Sort orders',
      empty: 'We have no quote records for this account.',
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
      cart: 'Cart',
    },
    seller: {
      apply: 'Apply',
      placeholder: '0',
      discount: 'Absolute Discount',
      expiryDate: 'Expiry Date',
      discountValidationText: 'Enter a valid absolute discount',
    },
    comments: {
      title: 'Contact',
      invalidComment: 'Invalid Input - Please type again...',
      allProducts: 'All Products',
    },
    details: {
      information: 'Quote Information',
      code: 'Quote ID',
      name: 'Name',
      created: 'Created',
      lastUpdated: 'Last Updated',
      estimatedTotal: 'Estimated Total',
      total: 'Total',
      description: 'Description',
      estimateAndDate: 'Estimated & Date',
      update: 'Update',
      expirationTime: 'Expiry Date',
      charactersLeft: 'characters left: {{count}}',
    },
    links: {
      newCart: 'New Cart',
      quotes: 'Quotes',
    },
    confirmActionDialog: {
      name: 'Name:',
      description: 'Description:',
      validity: 'This quote is valid until {{ expirationTime }}',
      confirmActionOption: { yes: 'Yes', no: 'No' },
      buyer: {
        submit: {
          title: 'Submit Quote Request {{ code }}?',
          confirmNote: 'Are you sure you want to submit this quote request?',
          successMessage: 'Quote request submitted successfully',
        },
        cancel: {
          title: 'Cancel Quote Request {{ code }}?',
          confirmNote: 'Are you sure you want to cancel this quote request',
          successMessage: 'Quote request cancelled',
        },
      },
      buyer_offer: {
        edit: {
          title: 'Confirm Edit Quote {{ code }}?',
          confirmNote: 'Are you sure you want to edit this approved quote?',
          warningNote:
            'This Quote has been Approved. Editing this Quote will prevent Checkout until new edits are approved.',
        },
        cancel: {
          title: 'Cancel Quote {{ code }}?',
          confirmNote: 'Are you sure you want to cancel this quote?',
          successMessage: 'Quote cancelled',
        },
      },
      seller: {
        submit: {
          title: 'Submit Quote {{ code }} for approval?',
          confirmNote:
            'Are you sure you want to submit this quote for approval?',
          successMessage: 'Quote submitted for approval successfully',
        },
      },
      approver: {
        approve: {
          title: 'Approve Quote {{ code }}?',
          confirmNote: 'Are you sure you want to approve this quote?',
          successMessage: 'Quote approved successfully',
        },
        reject: {
          title: 'Reject Quote {{ code }}?',
          confirmNote: 'Are you sure you want to reject this quote?',
          successMessage: 'Quote rejected',
        },
      },
    },
    requestDialog: {
      requestQuote: 'Request Quote',
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
      cartValidationIssue:
        'Quote request not possible because we found problems with your entries. Please review your cart.',
      absoluteDiscountIssue:
        'Choose a discount that does not exceed the total value',
      expirationDateIssue: 'Choose an expiration date in the future',
      threshold: {
        underThresholdError:
          'Total price of requested quote does not meet the minimum threshold',
      },
    },
  },
};
