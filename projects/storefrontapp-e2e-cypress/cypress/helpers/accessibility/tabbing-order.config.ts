import { TabElement } from './tabbing-order';

export enum TabbingOrderTypes {
  FORM_FIELD = 'formField',
  LINK = 'link',
  BUTTON = 'button',
  NG_SELECT = 'ngSelect',
  GENERIC_CHECKBOX = 'genericCheckbox',
  CHECKBOX_WITH_LABEL = 'checkboxWithLabel',
  IMG_LINK = 'imgLink',
  GENERIC_INPUT = 'genericInput',
  GENERIC_BUTTON = 'genericButton',
  GENERIC_NG_SELECT = 'genericNgSelect',
  ITEM_COUNTER = 'itemCounter',
  RADIO = 'radio',
}

export interface TabbingOrderConfig {
  [name: string]: TabElement[];
}

export const tabbingOrderConfig: TabbingOrderConfig = {
  login: [
    { value: 'userId', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'password', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'Forgot password?', type: TabbingOrderTypes.LINK },
    { value: 'Sign In', type: TabbingOrderTypes.BUTTON },
    { value: 'Register', type: TabbingOrderTypes.BUTTON },
  ],
  register: [
    { value: 'titleCode', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'firstName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'lastName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'email', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'password', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'passwordconf', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'newsletter', type: TabbingOrderTypes.FORM_FIELD },
    {
      value: 'termsandconditions',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    { value: 'Terms & Conditions', type: TabbingOrderTypes.LINK },
    { value: 'Register', type: TabbingOrderTypes.BUTTON },
    {
      value: 'I already have an account. Sign In',
      type: TabbingOrderTypes.LINK,
    },
  ],
  resetPassword: [
    { value: 'userEmail', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'Submit', type: TabbingOrderTypes.BUTTON },
    { value: 'Cancel', type: TabbingOrderTypes.BUTTON },
  ],
  cart: [
    {
      value:
        '/electronics-spa/en/USD/product/3708646/EOS%20500D%20%2B%2018-55mm%20IS%20%2B%20EF-S%2055-250%20IS',
      type: TabbingOrderTypes.IMG_LINK,
    },
    {
      value: 'EOS 500D + 18-55mm IS + EF-S 55-250 IS',
      type: TabbingOrderTypes.LINK,
    },
    { value: 'quantity', type: TabbingOrderTypes.ITEM_COUNTER },
    { value: '-', type: TabbingOrderTypes.BUTTON },
    { type: TabbingOrderTypes.GENERIC_INPUT },
    { value: '+', type: TabbingOrderTypes.BUTTON },
    { value: 'Remove', type: TabbingOrderTypes.LINK },
    {
      value: 'Proceed to Checkout',
      type: TabbingOrderTypes.BUTTON,
    },
  ],
  changePassword: [
    {
      value: 'oldPassword',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'newPassword',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'newPasswordConfirm',
      type: TabbingOrderTypes.FORM_FIELD,
    },
  ],
  updateEmail: [
    { value: 'email', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'confirmEmail', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'password', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'Cancel', type: TabbingOrderTypes.BUTTON },
    { value: 'Save', type: TabbingOrderTypes.BUTTON },
  ],
  footer: [
    {
      value: 'About SAP Commerce Cloud',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'Frequently Asked Questions',
      type: TabbingOrderTypes.LINK,
    },
    { value: 'Visit SAP', type: TabbingOrderTypes.LINK },
    { value: 'Contact Us', type: TabbingOrderTypes.LINK },
    {
      value: 'Agile Commerce Blog',
      type: TabbingOrderTypes.LINK,
    },
    { value: 'Linked In', type: TabbingOrderTypes.LINK },
    { value: 'Facebook', type: TabbingOrderTypes.LINK },
    { value: 'Twitter', type: TabbingOrderTypes.LINK },
  ],
  closeAccount: [
    { value: 'Cancel', type: TabbingOrderTypes.LINK },
    { value: 'CLOSE MY ACCOUNT', type: TabbingOrderTypes.BUTTON },
  ],
  personalDetails: [
    { value: 'titleCode', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'firstName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'lastName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'Cancel', type: TabbingOrderTypes.BUTTON },
    { value: 'Save', type: TabbingOrderTypes.BUTTON },
  ],
  paymentDetails: [
    { value: 'Delete', type: TabbingOrderTypes.LINK },
    { value: 'Set as default', type: TabbingOrderTypes.LINK },
    { value: 'Delete', type: TabbingOrderTypes.LINK },
  ],
  addressBookForm: [
    {
      value: 'isocode',
      type: TabbingOrderTypes.NG_SELECT,
    },
    {
      value: 'titleCode',
      type: TabbingOrderTypes.NG_SELECT,
    },
    {
      value: 'firstName',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'lastName',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'line1',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'line2',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'town',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'isocode',
      type: TabbingOrderTypes.NG_SELECT,
    },
    {
      value: 'postalCode',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'phone',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'defaultAddress',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    {
      value: 'Back to address list',
      type: TabbingOrderTypes.BUTTON,
    },
    {
      value: 'Add address',
      type: TabbingOrderTypes.BUTTON,
    },
  ],
  addressBookDirectory: [
    {
      value: 'Add new address',
      type: TabbingOrderTypes.BUTTON,
    },
    {
      value: 'Edit',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'Delete',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'Set as default',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'Edit',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'Delete',
      type: TabbingOrderTypes.LINK,
    },
  ],
  consentManagement: [
    {
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
      value:
        'This is a sample consent description that will need to be updated or replaced, based on the valid registration consent required',
    },
    {
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
      value:
        'This is a sample storage consent description that will need to be updated or replaced, based on the valid registration consent required.',
    },
  ],
  addToCart: [
    { value: 'view cart', type: TabbingOrderTypes.BUTTON },
    {
      value: 'proceed to checkout',
      type: TabbingOrderTypes.BUTTON,
    },
    { type: TabbingOrderTypes.GENERIC_BUTTON },
    {
      value:
        '/electronics-spa/en/USD/product/3708646/EOS%20500D%20%2B%2018-55mm%20IS%20%2B%20EF-S%2055-250%20IS',
      type: TabbingOrderTypes.IMG_LINK,
    },
    {
      value: 'EOS 500D + 18-55mm IS + EF-S 55-250 IS',
      type: TabbingOrderTypes.LINK,
    },
    { value: 'quantity', type: TabbingOrderTypes.ITEM_COUNTER },
    { value: '-', type: TabbingOrderTypes.BUTTON },
    { type: TabbingOrderTypes.GENERIC_INPUT },
    { value: '+', type: TabbingOrderTypes.BUTTON },
    { value: 'Remove', type: TabbingOrderTypes.LINK },
    { value: 'view cart', type: TabbingOrderTypes.BUTTON },
  ],
  shippingAddressNew: [
    { value: 'isocode', type: TabbingOrderTypes.GENERIC_INPUT },
    { value: 'titleCode', type: TabbingOrderTypes.GENERIC_INPUT },
    { value: 'firstName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'lastName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'line1', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'line2', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'town', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'isocode', type: TabbingOrderTypes.GENERIC_INPUT },
    { value: 'postalCode', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'phone', type: TabbingOrderTypes.FORM_FIELD },
    {
      value: 'Set as default',
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
    },
    { value: 'Back to cart', type: TabbingOrderTypes.BUTTON },
    { value: 'Continue', type: TabbingOrderTypes.BUTTON },
  ],
  shippingAddressExisting: [
    { value: 'Add New Address', type: TabbingOrderTypes.BUTTON },
    {
      value: 'Ship to this address',
      type: TabbingOrderTypes.LINK,
    },
    { value: 'Back to cart', type: TabbingOrderTypes.BUTTON },
    { value: 'Continue', type: TabbingOrderTypes.BUTTON },
  ],
  deliveryMode: [
    { value: 'deliveryModeId', type: TabbingOrderTypes.RADIO },
    { value: 'deliveryModeId', type: TabbingOrderTypes.RADIO },
    { value: 'Back', type: TabbingOrderTypes.BUTTON },
    { value: 'Continue', type: TabbingOrderTypes.BUTTON },
  ],
  orderHistoryNoOrders: [
    { value: 'Start Shopping', type: TabbingOrderTypes.BUTTON },
  ],
  paymentDetailsCard: [
    { type: TabbingOrderTypes.GENERIC_INPUT },
    {
      value: 'accountHolderName',
      type: TabbingOrderTypes.FORM_FIELD,
    },
    { value: 'cardNumber', type: TabbingOrderTypes.FORM_FIELD },
    { type: TabbingOrderTypes.GENERIC_INPUT },
    { type: TabbingOrderTypes.GENERIC_INPUT },
    { value: 'cvn', type: TabbingOrderTypes.FORM_FIELD },
    {
      value: 'Set as default',
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
    },
    {
      value: 'Same as shipping address',
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
    },
    { value: 'Back', type: TabbingOrderTypes.BUTTON },
    { value: 'Continue', type: TabbingOrderTypes.BUTTON },
  ],
  paymentDetailsBillingAddress: [
    { type: TabbingOrderTypes.GENERIC_INPUT },
    { value: 'firstName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'lastName', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'line1', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'line2', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'town', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'isocodeShort', type: TabbingOrderTypes.NG_SELECT },
    { value: 'postalCode', type: TabbingOrderTypes.FORM_FIELD },
    { value: 'Back', type: TabbingOrderTypes.BUTTON },
    { value: 'Continue', type: TabbingOrderTypes.BUTTON },
  ],
  reviewOrder: [
    {
      value: '/electronics-spa/en/USD/product/1446509/Alpha%20350',
      type: TabbingOrderTypes.IMG_LINK,
    },
    {
      value: 'Alpha 350',
      type: TabbingOrderTypes.LINK,
    },
  ],
  checkoutReviewOrder: [
    { value: 'Edit shipping address', type: TabbingOrderTypes.LINK },
    { value: 'Edit shipping method', type: TabbingOrderTypes.LINK },
    { value: 'Edit payment method', type: TabbingOrderTypes.LINK },
    {
      value: 'FUN Flash Single Use Camera, 27+12 pic',
      type: TabbingOrderTypes.LINK,
    },
    {
      value: 'I am confirming that I have read and agreed with',
      type: TabbingOrderTypes.CHECKBOX_WITH_LABEL,
    },
    { value: 'Terms & Conditions', type: TabbingOrderTypes.LINK },
    { value: 'Place Order', type: TabbingOrderTypes.BUTTON },
  ],
};
