import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ContentPage
import { CartPageModule } from './cart-page/cart-page.module';
import { OrderConfirmationPageModule } from './order-confirmation-page/order-confirmation-page.module';

import { ResetPasswordPageModule } from './reset-password-page/reset-password-page.module';
import { ResetNewPasswordPageModule } from './reset-new-password-page/reset-new-password-page.module';

// ProductPage
import { ProductPageModule } from './product-page/product-page.module';
import { RouterModule } from '@angular/router';
import { CmsPageGuard } from '../../cms/guards/cms-page.guard';
import { PageLayoutComponent } from '../../cms/page-layout/page-layout.component';
import { PageLayoutModule } from '../../cms/page-layout/page-layout.module';
import { AuthGuard, NotAuthGuard } from '@spartacus/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HardcodedCheckoutComponent } from './checkout-page.interceptor';
import { GuardsModule } from './guards/guards.module';
import { CartNotEmptyGuard } from './guards/cart-not-empty.guard';
import { LogoutModule } from '../../../cms-components/index';

const pageModules = [
  CartPageModule,
  OrderConfirmationPageModule,
  ProductPageModule,
  ResetPasswordPageModule,
  ResetNewPasswordPageModule,
  GuardsModule
];

@NgModule({
  imports: [
    CommonModule,
    ...pageModules,
    PageLayoutModule,
    LogoutModule,
    RouterModule.forChild([
      {
        // This route can be dropped only when we have a mapping path to page label for content pages
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'homepage', cxPath: 'home' }
      },
      {
        // This route can be dropped only when the link from CMS in MyAccount dropdown menu ("my-account/address-book")
        // is the same as the page label ("address-book"). Or when we have a mapping for content pages.
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'address-book', cxPath: 'addressBook' },
        component: PageLayoutComponent
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'orders', cxPath: 'orders' }
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard, CartNotEmptyGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'multiStepCheckoutSummaryPage', cxPath: 'checkout' }
      },
      {
        path: null,
        canActivate: [NotAuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'login', cxPath: 'login' }
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'search', cxPath: 'search' }
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxPath: 'category' }
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxPath: 'brand' }
      },
      // redirect OLD links
      {
        path: 'Open-Catalogue/:title/c/:categoryCode',
        redirectTo: null,
        data: { cxRedirectTo: 'category' }
      },
      {
        path: 'Open-Catalogue/:category1/:title/c/:categoryCode',
        redirectTo: null,
        data: { cxRedirectTo: 'category' }
      },
      {
        path: 'Open-Catalogue/:category1/:category2/:title/c/:categoryCode',
        redirectTo: null,
        data: { cxRedirectTo: 'category' }
      },
      {
        path: 'OpenCatalogue/:category1/:category2/:title/c/:categoryCode',
        redirectTo: null,
        data: { cxRedirectTo: 'category' }
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'payment-details', cxPath: 'paymentManagement' },
        component: PageLayoutComponent
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'order', cxPath: 'orderDetails' }
      },
      // PLEASE ADD ALL ROUTES ABOVE THIS LINE ===============================
      {
        path: '**',
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent
      }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HardcodedCheckoutComponent,
      multi: true
    }
  ]
})
export class PagesModule {}
