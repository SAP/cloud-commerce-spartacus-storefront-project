import { InjectionToken } from '@angular/core';
import { Converter } from '../../../util/converter.service';
import { PaymentDetails } from '../../../model/cart.model';

export const PAYMENT_DETAILS_NORMALIZER = new InjectionToken<
  Converter<any, PaymentDetails>
>('PaymentDetailsNormalizer');

export const PAYMENT_DETAILS_SERIALIZER = new InjectionToken<
  Converter<PaymentDetails, any>
>('PaymentDetailsSerializer');
