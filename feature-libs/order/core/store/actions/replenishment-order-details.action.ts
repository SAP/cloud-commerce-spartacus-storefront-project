/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActionErrorProperty,
  PROCESS_FEATURE,
  StateUtils,
} from '@spartacus/core';
import { ReplenishmentOrder } from '@spartacus/order/root';
import {
  CANCEL_REPLENISHMENT_ORDER_PROCESS_ID,
  REPLENISHMENT_ORDER_DETAILS,
} from '../order-state';

export const LOAD_REPLENISHMENT_ORDER_DETAILS =
  '[Order] Load Replenishment Order Details';
export const LOAD_REPLENISHMENT_ORDER_DETAILS_SUCCESS =
  '[Order] Load Replenishment Order Details Success';
export const LOAD_REPLENISHMENT_ORDER_DETAILS_FAIL =
  '[Order] Load Replenishment Order Details Fail';
export const ClEAR_REPLENISHMENT_ORDER_DETAILS =
  '[Order] Clear Replenishment Order Details';

export const CANCEL_REPLENISHMENT_ORDER = '[Order] Cancel Replenishment Order';
export const CANCEL_REPLENISHMENT_ORDER_SUCCESS =
  '[Order] Cancel Replenishment Order Success';
export const CANCEL_REPLENISHMENT_ORDER_FAIL =
  '[Order] Cancel Replenishment Order Fail';
export const CLEAR_CANCEL_REPLENISHMENT_ORDER =
  '[Order] Clear Cancel Replenishment Order';

export class LoadReplenishmentOrderDetails extends StateUtils.LoaderLoadAction {
  readonly type = LOAD_REPLENISHMENT_ORDER_DETAILS;

  constructor(
    public payload: {
      userId: string;
      replenishmentOrderCode: string;
    }
  ) {
    super(REPLENISHMENT_ORDER_DETAILS);
  }
}

export class LoadReplenishmentOrderDetailsSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = LOAD_REPLENISHMENT_ORDER_DETAILS_SUCCESS;

  constructor(public payload: ReplenishmentOrder) {
    super(REPLENISHMENT_ORDER_DETAILS);
  }
}

export class LoadReplenishmentOrderDetailsFail extends StateUtils.LoaderFailAction {
  readonly type = LOAD_REPLENISHMENT_ORDER_DETAILS_FAIL;

  constructor(error: ActionErrorProperty);
  /**
   * @deprecated Use the `error` parameter with a non-null, non-undefined value.
   *             Support for `null` or `undefined` will be removed in future versions,
   *             along with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing deprecated constructor
    error: any
  );
  constructor(public error: any) {
    super(REPLENISHMENT_ORDER_DETAILS, error);
  }
}

export class ClearReplenishmentOrderDetails extends StateUtils.LoaderResetAction {
  readonly type = ClEAR_REPLENISHMENT_ORDER_DETAILS;

  constructor() {
    super(REPLENISHMENT_ORDER_DETAILS);
  }
}

export class CancelReplenishmentOrder extends StateUtils.EntityLoadAction {
  readonly type = CANCEL_REPLENISHMENT_ORDER;

  constructor(
    public payload: {
      userId: string;
      replenishmentOrderCode: string;
    }
  ) {
    super(PROCESS_FEATURE, CANCEL_REPLENISHMENT_ORDER_PROCESS_ID);
  }
}

export class CancelReplenishmentOrderSuccess extends StateUtils.EntitySuccessAction {
  readonly type = CANCEL_REPLENISHMENT_ORDER_SUCCESS;

  constructor(public payload: ReplenishmentOrder) {
    super(PROCESS_FEATURE, CANCEL_REPLENISHMENT_ORDER_PROCESS_ID);
  }
}

export class CancelReplenishmentOrderFail extends StateUtils.EntityFailAction {
  readonly type = CANCEL_REPLENISHMENT_ORDER_FAIL;

  constructor(error: ActionErrorProperty);
  /**
   * @deprecated Use the `error` parameter with a non-null, non-undefined value.
   *             Support for `null` or `undefined` will be removed in future versions,
   *             along with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing deprecated constructor
    error: any
  );
  constructor(public error: any) {
    super(PROCESS_FEATURE, CANCEL_REPLENISHMENT_ORDER_PROCESS_ID, error);
  }
}

export class ClearCancelReplenishmentOrder extends StateUtils.EntityLoaderResetAction {
  readonly type = CLEAR_CANCEL_REPLENISHMENT_ORDER;

  constructor() {
    super(PROCESS_FEATURE, CANCEL_REPLENISHMENT_ORDER_PROCESS_ID);
  }
}

export type ReplenishmentOrderDetailsAction =
  | LoadReplenishmentOrderDetails
  | LoadReplenishmentOrderDetailsSuccess
  | LoadReplenishmentOrderDetailsFail
  | ClearReplenishmentOrderDetails
  | CancelReplenishmentOrder
  | CancelReplenishmentOrderSuccess
  | CancelReplenishmentOrderFail
  | ClearCancelReplenishmentOrder;
