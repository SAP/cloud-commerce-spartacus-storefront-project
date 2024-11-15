import {EntityScopedLoaderActions} from "../../../state/utils/scoped-loader/entity-scoped-loader.actions";

import { StateUtils } from '../../../state/utils';
import { PRODUCT_SEARCH_RESULTS_BY_CATEGORY_ENTITY } from '../product-state';

import { ErrorAction } from '../../../error-handling';
import { Product } from '../../../model/product.model';
export const PRODUCT_SEARCH_LOAD_BY_CATEGORY =
  '[Product] Product Search Load By Category';
export const PRODUCT_SEARCH_LOAD_BY_CATEGORY_SUCCESS =
  '[Product] Product Search Load By Category Success';
export const PRODUCT_SEARCH_LOAD_BY_CATEGORY_FAIL =
  '[Product] Product Search Load By Category Fail';
export const CLEAR_PRODUCT_SEARCH_BY_CATEGORY_STATE =
  '[Product] Clear Product Search By Category State';

export class ProductSearchLoadByCategory extends EntityScopedLoaderActions.EntityScopedLoadAction {
  readonly type = PRODUCT_SEARCH_LOAD_BY_CATEGORY;
  constructor(
    public payload: {
      categoryCode: string;
      scope: string;
    }
  ) {
    super(PRODUCT_SEARCH_RESULTS_BY_CATEGORY_ENTITY, payload.categoryCode, payload.scope);
  }
}

export class ProductSearchLoadByCategorySuccess extends EntityScopedLoaderActions.EntityScopedSuccessAction {
  readonly type = PRODUCT_SEARCH_LOAD_BY_CATEGORY_SUCCESS;
  constructor(payload: { products: Product[]; categoryCode: string; scope: string }) {
    super(
      PRODUCT_SEARCH_RESULTS_BY_CATEGORY_ENTITY,
      payload.categoryCode,
      payload.scope,
      payload.products
    );
  }
}

export class ProductSearchLoadByCategoryFail
  extends EntityScopedLoaderActions.EntityScopedFailAction
  implements ErrorAction
{
  readonly type = PRODUCT_SEARCH_LOAD_BY_CATEGORY_FAIL;
  constructor(payload: { categoryCode: string; scope: string; error: any }) {
    super(
      PRODUCT_SEARCH_RESULTS_BY_CATEGORY_ENTITY,
      payload.categoryCode,
      payload.scope,
      payload.error
    );
  }
}

export class ClearProductSearchByCategoryState extends StateUtils.EntityRemoveAllAction {
  readonly type = CLEAR_PRODUCT_SEARCH_BY_CATEGORY_STATE;
  constructor() {
    super(PRODUCT_SEARCH_RESULTS_BY_CATEGORY_ENTITY);
  }
}

// action types
export type ProductSearchByCategoryAction =
  | ProductSearchLoadByCategory
  | ProductSearchLoadByCategorySuccess
  | ProductSearchLoadByCategoryFail
  | ClearProductSearchByCategoryState;
