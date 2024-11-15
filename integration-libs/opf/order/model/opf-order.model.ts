import { Address, Occ, PaymentDetails } from '@spartacus/core';

export interface OpfOccOrder extends Omit<Occ.Order, 'paymentInfo'> {
  sapBillingAddress: Address;
  paymentInfo: Omit<PaymentDetails, 'billingAddress'>;
}
