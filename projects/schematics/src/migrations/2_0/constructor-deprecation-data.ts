import {
  ACTIVATED_ROUTE,
  ACTIVE_CART_SERVICE,
  ANGULAR_FORMS,
  ANGULAR_ROUTER,
  AUTH_REDIRECT_SERVICE,
  AUTH_SERVICE,
  CART_DATA_SERVICE,
  CART_SERVICE,
  CHECKOUT_CONFIG_SERVICE,
  CHECKOUT_DELIVERY_SERVICE,
  CHECKOUT_DETAILS_SERVICE,
  CHECKOUT_LOGIN_COMPONENT,
  CHECKOUT_PAYMENT_SERVICE,
  CHECKOUT_SERVICE,
  CMS_SERVICE,
  FEATURE_CONFIG_SERVICE,
  FORM_BUILDER,
  NGRX_STORE,
  NOT_CHECKOUT_AUTH_GUARD,
  ORDER_DETAILS_SERVICE,
  PAGE_META_RESOLVER,
  PAGE_META_SERVICE,
  PROMOTION_SERVICE,
  ROUTING_SERVICE,
  SHIPPING_ADDRESS_COMPONENT,
  SPARTACUS_CORE,
  SPARTACUS_STOREFRONTLIB,
  STORE,
  TRANSLATION_SERVICE,
  USER_ADDRESS_SERVICE,
} from '../../shared/constants';
import { ConstructorDeprecation } from '../../shared/utils/file-utils';

export const CONSTRUCTOR_DEPRECATION_DATA: ConstructorDeprecation[] = [
  // projects/core/src/user/facade/user-address.service.ts
  {
    class: USER_ADDRESS_SERVICE,
    deprecatedParams: [
      {
        className: STORE,
        importPath: NGRX_STORE,
      },
    ],
    addParams: [
      {
        className: AUTH_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/core/src/cms/facade/page-meta.service.ts
  {
    class: PAGE_META_SERVICE,
    deprecatedParams: [
      { className: PAGE_META_RESOLVER, importPath: SPARTACUS_CORE },
      { className: CMS_SERVICE, importPath: SPARTACUS_CORE },
      {
        className: FEATURE_CONFIG_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: FEATURE_CONFIG_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/core/src/checkout/facade/checkout.service.ts
  {
    class: CHECKOUT_SERVICE,
    deprecatedParams: [
      {
        className: STORE,
        importPath: NGRX_STORE,
      },
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: AUTH_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/core/src/checkout/facade/checkout-payment.service.ts
  {
    class: CHECKOUT_PAYMENT_SERVICE,
    deprecatedParams: [
      {
        className: STORE,
        importPath: NGRX_STORE,
      },
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: AUTH_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/core/src/checkout/facade/checkout-delivery.service.ts
  {
    class: CHECKOUT_DELIVERY_SERVICE,
    deprecatedParams: [
      {
        className: STORE,
        importPath: NGRX_STORE,
      },
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_DATA_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: AUTH_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/storefrontlib/src/shared/services/promotion/promotion.service.ts
  {
    class: PROMOTION_SERVICE,
    deprecatedParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: ORDER_DETAILS_SERVICE,
        importPath: SPARTACUS_STOREFRONTLIB,
      },
      {
        className: CHECKOUT_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/storefrontlib/src/cms-components/user/checkout-login/checkout-login.component.ts
  {
    class: CHECKOUT_LOGIN_COMPONENT,
    deprecatedParams: [
      {
        className: FORM_BUILDER,
        importPath: ANGULAR_FORMS,
      },
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: AUTH_REDIRECT_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/storefrontlib/src/cms-components/checkout/services/checkout-details.service.ts
  {
    class: CHECKOUT_DETAILS_SERVICE,
    deprecatedParams: [
      {
        className: CHECKOUT_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CHECKOUT_DELIVERY_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CHECKOUT_PAYMENT_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/storefrontlib/src/cms-components/checkout/guards/not-checkout-auth-guard.ts
  {
    class: NOT_CHECKOUT_AUTH_GUARD,
    deprecatedParams: [
      {
        className: ROUTING_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: AUTH_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
  // projects/storefrontlib/src/cms-components/checkout/components/shipping-address/shipping-address.component.ts
  {
    class: SHIPPING_ADDRESS_COMPONENT,
    deprecatedParams: [
      {
        className: USER_ADDRESS_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: ROUTING_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CHECKOUT_DELIVERY_SERVICE,
        importPath: SPARTACUS_CORE,
      },
      {
        className: CHECKOUT_CONFIG_SERVICE,
        importPath: SPARTACUS_STOREFRONTLIB,
      },
      {
        className: ACTIVATED_ROUTE,
        importPath: ANGULAR_ROUTER,
      },
      {
        className: TRANSLATION_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    removeParams: [
      {
        className: CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
    addParams: [
      {
        className: ACTIVE_CART_SERVICE,
        importPath: SPARTACUS_CORE,
      },
    ],
  },
];
