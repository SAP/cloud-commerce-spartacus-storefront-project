import { CardType, PaymentDetails } from '@spartacus/cart/main/root';
import { Observable } from 'rxjs';

export abstract class CheckoutPaymentAdapter {
  /**
   * Abstract method used to create payment details on cart
   *
   * @param userId
   * @param cartId
   * @param paymentDetails
   */
  abstract createPaymentDetails(
    userId: string,
    cartId: string,
    paymentDetails: PaymentDetails
  ): Observable<PaymentDetails>;

  /**
   * Abstract method used to set payment details on cart
   *
   * @param userId
   * @param cartId
   * @param paymentDetailsId
   */
  abstract setPaymentDetails(
    userId: string,
    cartId: string,
    paymentDetailsId: string
  ): Observable<unknown>;

  /**
   * Abstract method used to get available card types
   */
  abstract getCardTypes(): Observable<CardType[]>;
}
