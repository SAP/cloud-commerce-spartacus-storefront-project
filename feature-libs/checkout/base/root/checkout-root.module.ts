import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import {
  CmsPageGuard,
  ORDER_ENTRIES_CONTEXT,
  PageLayoutComponent,
} from '@spartacus/storefront';
import { defaultCheckoutConfig } from './config/default-checkout-config';
import { defaultCheckoutRoutingConfig } from './config/default-checkout-routing-config';
import { CheckoutEventModule } from './events/checkout-event.module';
import { CHECKOUT_CORE_FEATURE, CHECKOUT_FEATURE } from './feature-name';
import { interceptors } from './http-interceptors/index';
import { OrderConfirmationOrderEntriesContext } from './pages/order-confirmation-order-entries-context';

export function defaultCheckoutComponentsConfig() {
  const config: CmsConfig = {
    featureModules: {
      [CHECKOUT_FEATURE]: {
        cmsComponents: [
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
        ],
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
