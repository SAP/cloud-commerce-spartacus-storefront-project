import {
  ACTIVE_CART_SERVICE,
  AUTH_SERVICE,
  CART_DATA_SERVICE,
  CHECKOUT_DELIVERY_SERVICE,
  NGRX_STORE,
  SPARTACUS_CORE,
  STORE,
} from '../../../../shared/constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CHECKOUT_DELIVERY_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/core/src/checkout/facade/checkout-delivery.service.ts
  class: CHECKOUT_DELIVERY_SERVICE,
  importPath: SPARTACUS_CORE,
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
};
