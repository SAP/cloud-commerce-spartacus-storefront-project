import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  UserService,
  ConfigModule,
  CmsConfig,
  I18nModule,
  AuthGuard,
} from '@spartacus/core';
import { PaymentFormModule } from './payment-form/payment-form.module';
import { CardModule } from '../../../../shared/components/card/card.module';
import { PaymentMethodComponent } from './payment-method.component';
import { SpinnerModule } from '../../../../shared/components/spinner/spinner.module';
import { DeliveryModeSetGuard } from '../../guards/delivery-mode-set.guard';
import { CartNotEmptyGuard } from './../../../../cms-components/checkout/cart/cart-not-empty.guard';
import { ShippingAddressSetGuard } from './../../guards/shipping-address-set.guard';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PaymentFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPaymentDetails: {
          selector: 'cx-payment-method',
          guards: [
            AuthGuard,
            CartNotEmptyGuard,
            ShippingAddressSetGuard,
            DeliveryModeSetGuard,
          ],
        },
      },
    }),
  ],
  providers: [UserService],
  declarations: [PaymentMethodComponent],
  entryComponents: [PaymentMethodComponent],
  exports: [PaymentMethodComponent],
})
export class PaymentMethodModule {}
