import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ContentPage
import { PageNotFoundModule } from './404/404.module';
import { CartPageModule } from './cart-page/cart-page.module';
import { OrderConfirmationPageModule } from './order-confirmation-page/order-confirmation-page.module';
import { MultiStepCheckoutPageModule } from './multi-step-checkout-page/multi-step-checkout-page.module';
import { RegisterPageModule } from './register-page/register-page.module';
import { LoginPageModule } from './login-page/login-page.module';
import { ResetPasswordPageModule } from './reset-password-page/reset-password-page.module';
import { StoreFinderPageModule } from './store-finder-page/store-finder-page.module';
import { PaymentDetailsPageModule } from './payment-details-page/payment-details-page.module';

import { ContactPageModule } from './contact-page/contact-page.module';
import { SalePageModule } from './sale-page/sale-page.module';
import { HelpPageModule } from './help-page/help-page.module';
import { ResetNewPasswordPageModule } from './reset-new-password-page/reset-new-password-page.module';
import { TermsConditionsPageModule } from './terms-conditions-page/terms-conditions-page.module';
// ContentPage: my Account Pages
import { OrderHistoryPageModule } from './order-history-page/order-history-page.module';
import { OrderDetailsPageModule } from './order-details-page/order-details-page.module';
import { AddressBookPageModule } from './address-book-page/address-book-page.module';

// CategoryPage
import { CategoryPageModule } from './category-page/category-page.module';

// ProductPage
import { ProductPageModule } from './product-page/product-page.module';
import { RouterModule } from '@angular/router';
import { CmsPageGuards } from '../../cms/guards/cms-page.guard';
import { PageLayoutComponent } from '../../cms/page-layout/page-layout.component';
import { PageLayoutModule } from '../../cms/page-layout/page-layout.module';

const pageModules = [
  OrderHistoryPageModule,
  CategoryPageModule,
  CartPageModule,
  MultiStepCheckoutPageModule,
  OrderDetailsPageModule,
  OrderConfirmationPageModule,
  AddressBookPageModule,
  ProductPageModule,
  RegisterPageModule,
  LoginPageModule,
  PaymentDetailsPageModule,
  ResetPasswordPageModule,
  StoreFinderPageModule,
  ContactPageModule,
  SalePageModule,
  HelpPageModule,
  ResetNewPasswordPageModule,
  TermsConditionsPageModule,
  // new pages should be added above this line
  PageNotFoundModule
];

@NgModule({
  imports: [
    CommonModule,
    ...pageModules,
    PageLayoutModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [CmsPageGuards],
        component: PageLayoutComponent,
        data: { pageLabel: 'homepage', cxPath: 'home' }
      }
    ])
  ]
})
export class PagesModule {}
