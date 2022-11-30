/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { EntryGroup, OrderEntry } from '@spartacus/cart/base/root';
import { Product, SearchConfig, StateUtils } from '@spartacus/core';
import { BundleStarter } from '../../model/bundle.model';
import { BUNDLE_DATA } from '../bundle-state';

export const START_BUNDLE = '[Bundle] Start Bundle';
export const START_BUNDLE_SUCCESS = '[Bundle] Start Bundle Success';
export const START_BUNDLE_FAIL = '[Bundle] Start Bundle Fail';
export const GET_BUNDLE_ALLOWED_PRODUCTS =
  '[Bundle] Get Bundle Allowed Products';
export const GET_BUNDLE_ALLOWED_PRODUCTS_SUCCESS =
  '[Bundle] Get Bundle Allowed Products Success';
export const GET_BUNDLE_ALLOWED_PRODUCTS_FAIL =
  '[Bundle] Get Bundle Allowed Products Fail';
export const ADD_PRODUCT_TO_BUNDLE = '[Bundle] Add Product To Bundle Section';
export const REMOVE_PRODUCT_FROM_BUNDLE =
  '[Bundle] Remove Product From Bundle Section';

export class StartBundle extends StateUtils.LoaderLoadAction {
  readonly type = START_BUNDLE;
  constructor(
    public payload: {
      cartId: string;
      userId: string;
      bundleStarter: BundleStarter;
    }
  ) {
    super(BUNDLE_DATA);
  }
}

export class StartBundleSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = START_BUNDLE_SUCCESS;
  constructor(
    public payload: {
      userId?: string;
      cartId?: string;
      deliveryModeChanged?: boolean;
      entry?: OrderEntry;
      entryGroups?: EntryGroup[];
      quantity?: number;
      quantityAdded?: number;
      statusCode?: string;
      statusMessage?: string;
    }
  ) {
    super(BUNDLE_DATA);
  }
}

export class StartBundleFail extends StateUtils.LoaderFailAction {
  readonly type = START_BUNDLE_FAIL;
  constructor(
    public payload: {
      userId: string;
      cartId: string;
      bundleStarter: BundleStarter;
      error: any;
    }
  ) {
    super(BUNDLE_DATA, payload);
  }
}

export class GetBundleAllowedProducts extends StateUtils.LoaderLoadAction {
  readonly type = GET_BUNDLE_ALLOWED_PRODUCTS;
  constructor(
    public payload: {
      cartId: string;
      userId: string;
      entryGroupNumber: number;
      searchConfig?: SearchConfig | undefined;
    }
  ) {
    super(BUNDLE_DATA);
  }
}

export class GetBundleAllowedProductsSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = GET_BUNDLE_ALLOWED_PRODUCTS_SUCCESS;
  constructor(public payload: any) {
    super(BUNDLE_DATA);
  }
}

export class GetBundleAllowedProductsFail extends StateUtils.LoaderFailAction {
  readonly type = GET_BUNDLE_ALLOWED_PRODUCTS_FAIL;
  constructor(public payload: any) {
    super(BUNDLE_DATA, payload);
  }
}

export class AddProductToBundle extends StateUtils.LoaderLoadAction {
  readonly type = ADD_PRODUCT_TO_BUNDLE;
  constructor(
    public payload: {
      cartId: string;
      bundleId: number;
      sectionId: number;
      product: Product;
    }
  ) {
    super(BUNDLE_DATA);
  }
}

export class RemoveProductFromBundle extends StateUtils.LoaderLoadAction {
  readonly type = REMOVE_PRODUCT_FROM_BUNDLE;
  constructor(
    public payload: {
      cartId: string;
      bundleId: number;
      sectionId: number;
      product: Product;
    }
  ) {
    super(BUNDLE_DATA);
  }
}

export type CartBundleAction =
  | StartBundle
  | StartBundleSuccess
  | StartBundleFail
  | GetBundleAllowedProducts
  | GetBundleAllowedProductsSuccess
  | GetBundleAllowedProductsFail
  | AddProductToBundle
  | RemoveProductFromBundle;
