import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CART_FEATURE, ORDER_ENTRIES_CONTEXT } from '@spartacus/cart/main/root';
import {
  CmsConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import { CmsPageGuard, PageLayoutComponent } from '@spartacus/storefront';
import { defaultCheckoutConfig } from './config/default-checkout-config';
import { defaultCheckoutRoutingConfig } from './config/default-checkout-routing-config';
import { CheckoutEventModule } from './events/checkout-event.module';
import { CHECKOUT_CORE_FEATURE, CHECKOUT_FEATURE } from './feature-name';
import { interceptors } from './http-interceptors/index';
import { OrderConfirmationOrderEntriesContext } from './pages/order-confirmation-order-entries-context';

export const CHECKOUT_BASE_CMS_COMPONENTS: string[] = [
  'CheckoutOrchestrator',
  'CheckoutOrderSummary',
  'CheckoutProgress',
  'CheckoutProgressMobileBottom',
  'CheckoutProgressMobileTop',
  'CheckoutDeliveryMode',
  'CheckoutPaymentDetails',
  'CheckoutPlaceOrder',
  'CheckoutReviewOrder',
  'CheckoutShippingAddress',
  'GuestCheckoutLoginComponent',
  'OrderConfirmationThankMessageComponent',
  'OrderConfirmationItemsComponent',
  'OrderConfirmationTotalsComponent',
  'OrderConfirmationOverviewComponent',
];

export function defaultCheckoutComponentsConfig() {
  const config: CmsConfig = {
    featureModules: {
      [CHECKOUT_FEATURE]: {
        cmsComponents: CHECKOUT_BASE_CMS_COMPONENTS,
        dependencies: [CART_FEATURE],
      },
      // by default core is bundled together with components
      [CHECKOUT_CORE_FEATURE]: CHECKOUT_FEATURE,
    },
  };
  return config;
}

@NgModule({
  imports: [
    CheckoutEventModule,
    RouterModule.forChild([
      {
        // @ts-ignore
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: {
          cxRoute: 'orderConfirmation',
          cxContext: {
            [ORDER_ENTRIES_CONTEXT]: OrderConfirmationOrderEntriesContext,
          },
        },
      },
    ]),
  ],
  providers: [
    ...interceptors,
    provideDefaultConfig(defaultCheckoutRoutingConfig),
    provideDefaultConfig(defaultCheckoutConfig),
    provideDefaultConfigFactory(defaultCheckoutComponentsConfig),
  ],
})
export class CheckoutRootModule {}
