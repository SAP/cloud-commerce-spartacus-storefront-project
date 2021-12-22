import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartValidationGuard } from '@spartacus/cart/main/components';
import { CartNotEmptyGuard } from '@spartacus/checkout/base/components';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/root';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import {
  AddressFormModule,
  CardModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { B2BCheckoutShippingAddressComponent } from './checkout-shipping-address.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AddressFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutShippingAddress: {
          component: B2BCheckoutShippingAddressComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CartValidationGuard],
        },
      },
    }),
  ],
  declarations: [B2BCheckoutShippingAddressComponent],
  exports: [B2BCheckoutShippingAddressComponent],
})
export class B2BCheckoutShippingAddressModule {}
