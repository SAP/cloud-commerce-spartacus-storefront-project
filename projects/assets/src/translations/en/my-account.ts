export const myAccount = {
  orderDetails: {
    orderId: 'Order #',
    placed: 'Placed',
    status: 'Status',
    shippedOn: 'Shipped on',
    inProcess: 'In process...',
    pending: 'Pending',
    deliveryStatus_READY_FOR_PICKUP: 'Ready for pickup',
    deliveryStatus_PICKUP_COMPLETE: 'Picked up',
    deliveryStatus_SHIPPED: 'Shipped',
    deliveryStatus_CANCELLED: 'Cancelled',
    statusDisplay_cancelled: 'Cancelled',
    statusDisplay_cancelling: 'Cancel Pending',
    statusDisplay_completed: 'Completed',
    statusDisplay_created: 'Created',
    statusDisplay_error: 'Pending',
    statusDisplay_Error: 'Pending',
    statusDisplay_open: 'Open',
    statusDisplay_processing: 'In Process',
    consignmentTracking: {
      action: 'Track package',
      dialog: {
        header: 'Tracking Information',
        shipped: 'Shipped',
        estimate: 'Estimated Delivery',
        carrier: 'Delivery Service',
        trackingId: 'Tracking Number',
        noTracking:
          'The package has not been dispatched from the warehouse. ' +
          'The tracking information will be available after the package is shipped.',
        loadingHeader: 'Consignment Tracking',
      },
    },
    cancellationAndReturn: {
      returnAction: 'Request a Return',
      cancelAction: 'Cancel Items',
      item: 'Item',
      itemPrice: 'Item Price',
      quantity: 'Max Quantity',
      returnQty: 'Quantity to Return',
      cancelQty: 'Quantity to Cancel',
      setAll: 'Set all quantities to maximum',
      totalPrice: 'Total',
      submit: 'Submit Request',
      returnNote: 'The following items will be included in the return request.',
      cancelNote:
        'The following items will be included in the cancellation request.',
      returnSuccess: 'Your return request ({{rma}}) was submitted',
      cancelSuccess:
        'Your cancellation request was submitted (original order {{orderCode}} will be updated)',
    },
  },
  orderHistory: {
    orderHistory: 'Order history',
    orderId: 'Order #',
    date: 'Date',
    status: 'Status',
    total: 'Total',
    noOrders: 'We have no order records for this account.',
    startShopping: 'Start Shopping',
    sortByMostRecent: 'Sort by Most recent',
  },
  closeAccount: {
    confirmAccountClosure: 'Confirm Account Closure',
    confirmAccountClosureMessage:
      'Are you sure you want to close your account?',
    closeMyAccount: 'CLOSE MY ACCOUNT',
    accountClosedSuccessfully: 'Account closed with success',
    accountClosedFailure: 'Failed to close account',
  },
  updateEmailForm: {
    newEmailAddress: {
      label: 'New email address',
      placeholder: 'Enter email',
    },
    confirmNewEmailAddress: {
      label: 'Confirm new email address',
      placeholder: 'Enter email',
    },
    enterValidEmail: 'Please enter a valid email.',
    bothEmailMustMatch: 'Both emails must match',
    password: {
      label: 'Password',
      placeholder: 'Enter password',
    },
    pleaseInputPassword: 'Please input password',
    emailUpdateSuccess: 'Success. Please sign in with {{ newUid }}',
  },
  updatePasswordForm: {
    oldPassword: {
      label: 'Old Password',
      placeholder: 'Old Password',
    },
    oldPasswordIsRequired: 'Old password is required.',
    newPassword: {
      label: 'New Password',
      placeholder: 'New Password',
    },
    passwordMinRequirements:
      'Password must be six characters minimum, with one uppercase letter, one number, one symbol',
    confirmPassword: {
      label: 'Confirm New Password',
      placeholder: 'Confirm Password',
    },
    bothPasswordMustMatch: 'Both password must match',
    passwordUpdateSuccess: 'Password updated with success',
  },
  updateProfileForm: {
    title: '',
    none: '',
    firstName: {
      label: 'First name',
      placeholder: 'First name',
    },
    firstNameIsRequired: 'First name is required.',
    lastName: {
      label: 'Last name',
      placeholder: 'Last name',
    },
    lastNameIsRequired: 'Last name is required.',
    profileUpdateSuccess: 'Personal details successfully updated',
  },
  consentManagementForm: {
    clearAll: 'Clear all',
    selectAll: 'Select all',
    message: {
      success: {
        given: 'Consent successfully given.',
        withdrawn: 'Consent successfully withdrawn.',
      },
    },
  },
  AccountOrderHistoryTabContainer: {
    tabs: {
      AccountOrderHistoryComponent: 'ALL ORDERS ({{param}})',
      OrderReturnRequestListComponent: 'RETURNS ({{param}})',
    },
  },
  returnRequestList: {
    returnRequestId: 'Return #',
    orderId: 'Order #',
    date: 'Date Created',
    status: 'Status',
    sortByMostRecent: 'Sort by Most recent',
    statusDisplay_APPROVAL_PENDING: 'Approval Pending',
    statusDisplay_CANCELED: 'Cancelled',
    statusDisplay_CANCELLING: 'Cancelling',
    statusDisplay_WAIT: 'Wait',
    statusDisplay_RECEIVED: 'Received',
    statusDisplay_RECEIVING: 'Receiving',
    statusDisplay_APPROVING: 'Approving',
    statusDisplay_REVERSING_PAYMENT: 'Reversing Payment',
    statusDisplay_PAYMENT_REVERSED: 'Payment Reversed',
    statusDisplay_PAYMENT_REVERSAL_FAILED: 'Payment Reversal Failed',
    statusDisplay_REVERSING_TAX: 'Reversing Tax',
    statusDisplay_TAX_REVERSED: 'Tax Reversed',
    statusDisplay_TAX_REVERSAL_FAILED: 'Tax Reversal Failed',
    statusDisplay_COMPLETED: 'Completed',
  },
  returnRequest: {
    returnRequestId: 'Return Request #',
    orderCode: 'For Order #',
    status: 'Return status',
    cancel: 'Cancel Return Request',
    item: 'Descripton',
    itemPrice: 'Item Price',
    returnQty: 'Return Quanity',
    total: 'Total',
    summary: 'Return Totals',
    subtotal: 'Subtotal',
    deliveryCode: 'Delivery cost',
    estimatedRefund: 'Estimated refund',
  },
};
