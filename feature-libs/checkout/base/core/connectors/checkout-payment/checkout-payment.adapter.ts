import { CardType, PaymentDetails } from '@spartacus/core';
import { Observable } from 'rxjs';

export abstract class CheckoutPaymentAdapter {
  /**
   * Abstract method used to create payment details on cart
   */
  abstract createPaymentDetails(
    userId: string,
    cartId: string,
    paymentDetails: PaymentDetails
  ): Observable<PaymentDetails>;

  /**
   * Abstract method used to set payment details on cart
   */
  abstract setPaymentDetails(
    userId: string,
    cartId: string,
    paymentDetailsId: string
  ): Observable<unknown>;

  /**
   * Abstract method used to get available cart types
   */
  abstract getCardTypes(): Observable<CardType[]>;
}
