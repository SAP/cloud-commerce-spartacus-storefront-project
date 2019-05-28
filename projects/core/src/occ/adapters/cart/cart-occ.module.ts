import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartAdapter } from '../../../cart/connectors/cart/cart.adapter';
import { OccCartAdapter } from './occ-cart.adapter';
import { CheckoutDeliveryAdapter } from '../../../checkout/connectors/delivery/cart-delivery.adapter';
import { OccCartDeliveryAdapter } from './occ-cart-delivery.adapter';
import { CartEntryAdapter } from '../../../cart/connectors/entry/cart-entry.adapter';
import { OccCartEntryAdapter } from './occ-cart-entry.adapter';
import { CheckoutPaymentAdapter } from '../../../checkout/connectors/payment/cart-payment.adapter';
import { OccCartPaymentAdapter } from './occ-cart-payment.adapter';
import { CART_NORMALIZER } from '../../../cart/connectors/cart/converters';
import { OccCartNormalizer } from './converters/occ-cart-normalizer';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: CartAdapter,
      useClass: OccCartAdapter,
    },
    {
      provide: CART_NORMALIZER,
      useClass: OccCartNormalizer,
      multi: true,
    },
    {
      provide: CheckoutDeliveryAdapter,
      useClass: OccCartDeliveryAdapter,
    },
    {
      provide: CartEntryAdapter,
      useClass: OccCartEntryAdapter,
    },
    {
      provide: CheckoutPaymentAdapter,
      useClass: OccCartPaymentAdapter,
    },
  ],
})
export class CartOccModule {}
