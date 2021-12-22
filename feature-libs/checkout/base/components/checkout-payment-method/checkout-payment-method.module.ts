import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/root';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { CardModule, SpinnerModule } from '@spartacus/storefront';
import { CartNotEmptyGuard } from '../guards/cart-not-empty.guard';
import { CheckoutPaymentFormModule } from './checkout-payment-form/checkout-payment-form.module';
import { CheckoutPaymentMethodComponent } from './checkout-payment-method.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CheckoutPaymentFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPaymentDetails: {
          component: CheckoutPaymentMethodComponent,
          // TODO(#8880): Shouldn't we keep ShippingAddressSetGuard and others here?
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [CheckoutPaymentMethodComponent],
  exports: [CheckoutPaymentMethodComponent],
})
export class CheckoutPaymentMethodModule {}
