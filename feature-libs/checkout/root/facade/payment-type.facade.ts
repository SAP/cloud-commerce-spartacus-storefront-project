import { Injectable } from '@angular/core';
import { facadeFactory, PaymentType } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CHECKOUT_CORE_FEATURE } from '../feature-name';

export function paymentTypeFacadeFactory() {
  return facadeFactory({
    facade: PaymentTypeFacade,
    feature: CHECKOUT_CORE_FEATURE,
    methods: [
      'getPaymentTypes',
      'setPaymentType',
      'getSelectedPaymentType',
      'isAccountPayment',
      'getPoNumber',
    ],
    async: true,
  });
}

@Injectable({
  providedIn: 'root',
  useFactory: paymentTypeFacadeFactory,
})
export abstract class PaymentTypeFacade {
  /**
   * Get payment types
   */
  abstract getPaymentTypes(): Observable<PaymentType[]>;

  /**
   * Set payment type to cart
   * @param typeCode
   * @param poNumber : purchase order number
   */
  abstract setPaymentType(typeCode: string, poNumber?: string): void;

  /**
   * Get the selected payment type
   */
  abstract getSelectedPaymentType(): Observable<string | undefined>;

  /**
   * Get whether the selected payment type is "ACCOUNT" payment
   */
  abstract isAccountPayment(): Observable<boolean>;

  /**
   * Get PO Number
   */
  abstract getPoNumber(): Observable<string | undefined>;
}
