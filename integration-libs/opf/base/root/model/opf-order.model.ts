import { Address, Occ, PaymentDetails } from '@spartacus/core';

export interface OpfOrder extends Occ.Order {}

export interface OpfOrder extends Omit<Occ.Order, 'paymentInfo'> {
  sapBillingAddress: Address;
  paymentInfo: Omit<PaymentDetails, 'billingAddress'>;
}
