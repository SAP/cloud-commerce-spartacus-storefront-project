export const UTF_8 = 'utf-8';

/***** Imports start *****/
export const ANGULAR_SCHEMATICS = '@schematics/angular';
export const ANGULAR_CORE = '@angular/core';
export const ANGULAR_FORMS = '@angular/forms';
export const ANGULAR_ROUTER = '@angular/router';
export const RXJS = 'rxjs';

export const SPARTACUS_CORE = '@spartacus/core';
export const SPARTACUS_STOREFRONTLIB = '@spartacus/storefront';
export const SPARTACUS_CDS = '@spartacus/cds';

export const NGRX_STORE = '@ngrx/store';
/***** Imports end *****/

/***** Classes start *****/
export const OBSERVABLE_CLASS = 'Observable';

export const STORE = 'Store';

export const FORM_BUILDER = 'FormBuilder';

export const CHANGE_DETECTOR_REF = 'ChangeDetectorRef';

export const ACTIVATED_ROUTE = 'ActivatedRoute';
export const ROUTER = 'Router';

export const CMS_COMPONENT_DATA_CLASS = 'CmsComponentData';
export const CONFIG_MODULE_CLASS = 'ConfigModule';
export const CMS_CONFIG = 'CmsConfig';
export const CMS_SELECTORS = 'CmsSelectors';
export const CMS_ACTIONS = 'CmsActions';
export const LOAD_CMS_COMPONENT_CLASS = 'LoadCmsComponent';
export const LOAD_CMS_COMPONENT_FAIL_CLASS = 'LoadCmsComponentFail';
export const LOAD_CMS_COMPONENT_SUCCESS_CLASS = 'LoadCmsComponentSuccess';
export const CMS_GET_COMPONENT_FROM_PAGE = 'CmsGetComponentFromPage';
export const USER_ADDRESS_SERVICE = 'UserAddressService';
export const AUTH_SERVICE = 'AuthService';
export const FEATURE_CONFIG_SERVICE = 'FeatureConfigService';
export const PAGE_META_RESOLVER = 'PageMetaResolver';
export const CMS_SERVICE = 'CmsService';
export const PAGE_META_SERVICE = 'PageMetaService';
export const CHECKOUT_SERVICE = 'CheckoutService';
export const CHECKOUT_PAYMENT_SERVICE = 'CheckoutPaymentService';
export const CHECKOUT_DELIVERY_SERVICE = 'CheckoutDeliveryService';
export const CART_DATA_SERVICE = 'CartDataService';
export const CART_SERVICE = 'CartService';
export const ACTIVE_CART_SERVICE = 'ActiveCartService';
export const PROMOTION_SERVICE = 'PromotionService';
export const ORDER_DETAILS_SERVICE = 'OrderDetailsService';
export const CHECKOUT_LOGIN_COMPONENT = 'CheckoutLoginComponent';
export const AUTH_REDIRECT_SERVICE = 'AuthRedirectService';
export const CHECKOUT_DETAILS_SERVICE = 'CheckoutDetailsService';
export const NOT_CHECKOUT_AUTH_GUARD = 'NotCheckoutAuthGuard';
export const ROUTING_SERVICE = 'RoutingService';
export const SHIPPING_ADDRESS_COMPONENT = 'ShippingAddressComponent';
export const CHECKOUT_CONFIG_SERVICE = 'CheckoutConfigService';
export const TRANSLATION_SERVICE = 'TranslationService';
export const CHECKOUT_PAGE_META_RESOLVER = 'CheckoutPageMetaResolver';
export const ADD_TO_CART_COMPONENT = 'AddToCartComponent';
export const MODAL_SERVICE = 'ModalService';
export const CURRENT_PRODUCT_SERVICE = 'CurrentProductService';
export const CART_NOT_EMPTY_GUARD = 'CartNotEmptyGuard';
export const CART_TOTALS_COMPONENT = 'CartTotalsComponent';
export const MINI_CART_COMPONENT = 'MiniCartComponent';
export const CHECKOUT_ORDER_SUMMARY_COMPONENT = 'CheckoutOrderSummaryComponent';
export const CHECKOUT_PROGRESS_MOBILE_TOP_COMPONENT =
  'CheckoutProgressMobileTopComponent';
export const CHECKOUT_CONFIG = 'CheckoutConfig';
export const ROUTING_CONFIG_SERVICE = 'RoutingConfigService';
export const PAYMENT_METHOD_COMPONENT = 'PaymentMethodComponent';
export const USER_PAYMENT_SERVICE = 'UserPaymentService';
export const GLOBAL_MESSAGE_SERVICE = 'GlobalMessageService';
export const CHECKOUT_AUTH_GUARD = 'CheckoutAuthGuard';
export const CART_PAGE_LAYOUT_HANDLER = 'CartPageLayoutHandler';
export const SELECTIVE_CART_SERVICE = 'SelectiveCartService';
export const CDS_SPARTACUS_EVENT_SERVICE = 'SpartacusEventService';
export const CONSENT_SERVICE = 'ConsentService';
export const CDS_CONFIG = 'CdsConfig';
export const ADDRESS_BOOK_COMPONENT_SERVICE = 'AddressBookComponentService';
export const CHECKOUT_GUARD = 'CheckoutGuard';
export const EXPRESS_CHECKOUT_SERVICE = 'ExpressCheckoutService';
export const CONSENT_MANAGEMENT_FORM_COMPONENT =
  'ConsentManagementFormComponent';
/***** Classes end *****/

/***** Removed public api start *****/
export const CART_EFFECTS = 'CartEffects';
export const WISHLIST_EFFECTS = 'WishlistEffects';
export const CART_VOUCHER_EFFECTS = 'CartVoucherEffects';
export const CART_ENTRY_EFFECTS = 'CartEntryEffects';
export const CART_COMBINED_EFFECTS = 'effects';

export const GET_REDUCERS = 'getReducers';
export const REDUCER_TOKEN = 'reducerToken';
export const REDUCER_PROVIDER = 'reducerProvider';
export const CLEAR_CART_STATE = 'clearCartState';
export const META_REDUCERS = 'metaReducers';
export const CLEAR_MULTI_CART_STATE = 'clearMultiCartState';
export const MULTI_CART_META_REDUCERS = 'multiCartMetaReducers';
export const MULTI_CART_REDUCER_TOKEN = 'multiCartReducerToken';
export const GET_MULTI_CART_REDUCERS = 'getMultiCartReducers';
export const MULTI_CART_REDUCER_PROVIDER = 'multiCartReducerProvider';

export const SITE_CONTEXT_PARAMS_PROVIDERS = 'siteContextParamsProviders';
export const INIT_SITE_CONTEXT_ROUTES_HANDLER = 'initSiteContextRoutesHandler';
export const INITITIALIZE_CONTEXT = 'inititializeContext';
export const CONTEXT_SERVICE_PROVIDERS = 'contextServiceProviders';
/***** Removed public api end *****/

/***** Properties start *****/
export const CMS_COMPONENT_DATA_PROPERTY_NAME = 'componentData';
/***** Properties end *****/

/***** APIs start *****/
export const TODO_SPARTACUS = 'TODO:Spartacus -';

export const GET_COMPONENT_STATE_OLD_API = 'getComponentState';
export const GET_COMPONENTS_STATE_NEW_API = 'getComponentsState';

export const GET_COMPONENT_ENTITIES_OLD_API = 'getComponentEntities';
export const GET_COMPONENT_ENTITIES_COMMENT = `// ${TODO_SPARTACUS} '${GET_COMPONENT_ENTITIES_OLD_API}' has been removed, please use some of the newer API methods.`;

export const COMPONENT_STATE_SELECTOR_FACTORY_OLD_API =
  'componentStateSelectorFactory';
export const COMPONENTS_STATE_SELECTOR_FACTORY_NEW_API =
  'componentsLoaderStateSelectorFactory';

export const COMPONENT_SELECTOR_FACTORY_OLD_API = 'componentSelectorFactory';
export const COMPONENTS_SELECTOR_FACTORY_NEW_API = 'componentsSelectorFactory';
/***** APIs end *****/

/***** Misc start *****/
export const CSS_DOCS_URL =
  'https://sap.github.io/cloud-commerce-spartacus-storefront-docs/deprecation-guide/css';
/***** Misc end *****/
