import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { PromotionsModule } from '../../misc/promotions/promotions.module';
import { CartCouponModule } from '../cart-coupon/cart-coupon.module';
import { CartSharedModule } from '../cart-shared/cart-shared.module';
import { CartDetailsComponent } from './cart-details.component';

/**
 * @deprecated since 4.1 - use cart lib instead
 */
@NgModule({
  imports: [
    CartSharedModule,
    CommonModule,
    CartCouponModule,
    RouterModule,
    UrlModule,
    PromotionsModule,
    FeaturesConfigModule,
    I18nModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CartComponent: {
          component: CartDetailsComponent,
        },
      },
    }),
  ],
  declarations: [CartDetailsComponent],
  exports: [CartDetailsComponent],
})
export class CartDetailsModule {}
