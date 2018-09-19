import { NgModule } from '@angular/core';

// main: header, footer components
import { MainModule } from './main/main.module';

// layout
import { CategoryPageLayoutModule } from './category-page-layout/category-page-layout.module';
import { LandingPageLayoutModule } from './landing-page-layout/landing-page-layout.module';
import { ProductListPageLayoutModule } from './product-list-page-layout/product-list-page-layout.module';
import { ProductDetailsPageLayoutModule } from './product-details-page-layout/product-details-page-layout.module';
import { CartPageLayoutModule } from './cart-page-layout/cart-page-layout.module';
import { MultiStepCheckoutPageLayoutModule } from './multi-step-checkout-page-layout/multi-step-checkout-page-layout.module';
import { OrderConfirmationPageLayoutModule } from './order-confirmation-page-layout/order-confirmation-page-layout.module';
import { OrderHistoryPageLayoutModule } from './order-history-page-layout/order-history-page-layout.module';
import { OrderDetailsPageLayoutModule } from './order-details-page-layout/order-details-page-layout.module';
import { RegisterLayoutModule } from './register-layout/register-layout.module';
import { LoginPageLayoutModule } from './login-page-layout/login-page-layout.module';
import { StoreFinderPageLayoutModule } from './store-finder-page-layout/store-finder-page-layout.module';
import { PaymentDetailsPageLayoutModule } from './payment-details-page-layout/payment-details-page-layout.module';

@NgModule({
  imports: [
    MainModule,
    LandingPageLayoutModule,
    OrderHistoryPageLayoutModule,
    CartPageLayoutModule,
    CategoryPageLayoutModule,
    ProductListPageLayoutModule,
    MultiStepCheckoutPageLayoutModule,
    OrderDetailsPageLayoutModule,
    OrderConfirmationPageLayoutModule,
    ProductDetailsPageLayoutModule,
    RegisterLayoutModule,
    LoginPageLayoutModule,
    PaymentDetailsPageLayoutModule,
    StoreFinderPageLayoutModule
  ],
  declarations: [],
  exports: [
    MainModule,
    LandingPageLayoutModule,
    OrderHistoryPageLayoutModule,
    CartPageLayoutModule,
    CategoryPageLayoutModule,
    ProductListPageLayoutModule,
    MultiStepCheckoutPageLayoutModule,
    OrderDetailsPageLayoutModule,
    OrderConfirmationPageLayoutModule,
    ProductDetailsPageLayoutModule,
    RegisterLayoutModule,
    LoginPageLayoutModule,
    PaymentDetailsPageLayoutModule,
    StoreFinderPageLayoutModule
  ]
})
export class LayoutModule {}
