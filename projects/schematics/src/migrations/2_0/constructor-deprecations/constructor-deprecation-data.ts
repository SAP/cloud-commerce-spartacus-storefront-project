import { ConstructorDeprecation } from '../../../shared/utils/file-utils';
import { ADD_TO_CART_COMPONENT_MIGRATION } from './data/add-to-cart.component.migration';
import { ADDED_TO_CART_DIALOG_COMPONENT_MIGRATIONS } from './data/added-to-cart-dialog.component.migration';
import { ADDRESS_BOOK_COMPONENT_SERVICE_MIGRATIONS } from './data/address-book.component.service.migration';
import { CART_DETAILS_COMPONENT_MIGRATIONS } from './data/cart-details.component.migration';
import { CART_NOT_EMPTY_GUARD_MIGRATION } from './data/cart-not-empty.guard.migration';
import { CART_PAGE_LAYOUT_HANDLER_MIGRATIONS } from './data/cart-page-layout-handler.migration';
import { CART_TOTALS_COMPONENT_MIGRATION } from './data/cart-totals.component.migration';
import { CHECKOUT_AUTH_GUARD_MIGRATION } from './data/checkout-auth.guard.migration';
import { CHECKOUT_DELIVERY_SERVICE_MIGRATION } from './data/checkout-delivery.service.migration';
import { CHECKOUT_DETAILS_SERVICE_MIGRATION } from './data/checkout-details.service.migration';
import { CHECKOUT_LOGIN_COMPONENT_MIGRATION } from './data/checkout-login.component.migration';
import { CHECKOUT_ORDER_SUMMARY_COMPONENT_MIGRATION } from './data/checkout-order-summary.component.migration';
import { CHECKOUT_PAGE_META_RESOLVER_MIGRATION } from './data/checkout-page-meta.resolver.migration';
import { CHECKOUT_PAYMENT_SERVICE_MIGRATION } from './data/checkout-payment.service.migration';
import { CHECKOUT_PROGRESS_MOBILE_TOP_COMPONENT_MIGRATION } from './data/checkout-progress-mobile-top.migration';
import { CHECKOUT_GUARD_MIGRATIONS } from './data/checkout.guard.migration';
import { CHECKOUT_SERVICE_MIGRATION } from './data/checkout.service.migration';
import { MINI_CART_COMPONENT_MIGRATION } from './data/mini-cart.component.migration';
import { NOT_CHECKOUT_AUTH_GUARD_MIGRATION } from './data/not-checkout-auth-guard.migration';
import { ORDER_CONFIRMATION_ITEMS_COMPONENT_MIGRATION } from './data/order-confirmation-items.component.migration';
import { ORDER_DETAIL_ITEMS_COMPONENT_MIGRATION } from './data/order-detail-items.component.migration';
import { PAGE_META_SERVICE_MIGRATION } from './data/page-meta.service.migration';
import { PAYMENT_METHOD_COMPONENT_MIGRATIONS } from './data/payment-method.component.migration';
import { PROMOTION_SERVICE_MIGRATION } from './data/promotion.service.migration';
import { REVIEW_SUBMIT_COMPONENT_MIGRATIONS } from './data/review-submit.component.migration';
import { SHIPPING_ADDRESS_COMPONENT_MIGRATION } from './data/shipping-address.component.migration';
import { CDS_SPARTACUS_EVENT_SERVICE_MIGRATION } from './data/spartacus-event.service.migration';
import { USER_ADDRESS_SERVICE_MIGRATION } from './data/user-address.service.migration';

export const CONSTRUCTOR_DEPRECATION_DATA: ConstructorDeprecation[] = [
  USER_ADDRESS_SERVICE_MIGRATION,
  PAGE_META_SERVICE_MIGRATION,
  CHECKOUT_SERVICE_MIGRATION,
  CHECKOUT_PAYMENT_SERVICE_MIGRATION,
  CHECKOUT_DELIVERY_SERVICE_MIGRATION,
  PROMOTION_SERVICE_MIGRATION,
  CHECKOUT_LOGIN_COMPONENT_MIGRATION,
  CHECKOUT_DETAILS_SERVICE_MIGRATION,
  NOT_CHECKOUT_AUTH_GUARD_MIGRATION,
  SHIPPING_ADDRESS_COMPONENT_MIGRATION,
  CHECKOUT_PAGE_META_RESOLVER_MIGRATION,
  ADD_TO_CART_COMPONENT_MIGRATION,
  CART_NOT_EMPTY_GUARD_MIGRATION,
  CART_TOTALS_COMPONENT_MIGRATION,
  MINI_CART_COMPONENT_MIGRATION,
  ...ADDRESS_BOOK_COMPONENT_SERVICE_MIGRATIONS,
  ...CHECKOUT_GUARD_MIGRATIONS,
  CHECKOUT_ORDER_SUMMARY_COMPONENT_MIGRATION,
  CHECKOUT_PROGRESS_MOBILE_TOP_COMPONENT_MIGRATION,
  ...PAYMENT_METHOD_COMPONENT_MIGRATIONS,
  CHECKOUT_AUTH_GUARD_MIGRATION,
  ...CART_PAGE_LAYOUT_HANDLER_MIGRATIONS,
  CDS_SPARTACUS_EVENT_SERVICE_MIGRATION,
  ...ADDED_TO_CART_DIALOG_COMPONENT_MIGRATIONS,
  ...CART_DETAILS_COMPONENT_MIGRATIONS,
  ...REVIEW_SUBMIT_COMPONENT_MIGRATIONS,
  ORDER_DETAIL_ITEMS_COMPONENT_MIGRATION,
  ORDER_CONFIRMATION_ITEMS_COMPONENT_MIGRATION,
];
