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
import {
  CancellationRequestEntryInputList,
  Order,
} from '@spartacus/order/root';
import { CANCEL_ORDER_PROCESS_ID, ORDER_DETAILS } from '../order-state';

export const LOAD_ORDER_DETAILS = '[Order] Load Order Details';
export const LOAD_ORDER_DETAILS_FAIL = '[Order] Load Order Details Fail';
export const LOAD_ORDER_DETAILS_SUCCESS = '[Order] Load Order Details Success';
export const CLEAR_ORDER_DETAILS = '[Order] Clear Order Details';

export const CANCEL_ORDER = '[Order] Cancel Order';
export const CANCEL_ORDER_FAIL = '[Order] Cancel Order Fail';
export const CANCEL_ORDER_SUCCESS = '[Order] Cancel Order Success';
export const RESET_CANCEL_ORDER_PROCESS = '[Order] Reset Cancel Order Process';

export class LoadOrderDetails extends StateUtils.LoaderLoadAction {
  readonly type = LOAD_ORDER_DETAILS;
  constructor(
    public payload: {
      userId: string;
      orderCode: string;
    }
  ) {
    super(ORDER_DETAILS);
  }
}

export class LoadOrderDetailsFail extends StateUtils.LoaderFailAction {
  readonly type = LOAD_ORDER_DETAILS_FAIL;

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
    super(ORDER_DETAILS, error);
  }
}

export class LoadOrderDetailsSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = LOAD_ORDER_DETAILS_SUCCESS;
  constructor(public payload: Order) {
    super(ORDER_DETAILS);
  }
}

export class ClearOrderDetails extends StateUtils.LoaderResetAction {
  readonly type = CLEAR_ORDER_DETAILS;
  constructor() {
    super(ORDER_DETAILS);
  }
}

export class CancelOrder extends StateUtils.EntityLoadAction {
  readonly type = CANCEL_ORDER;
  constructor(
    public payload: {
      userId: string;
      orderCode: string;
      cancelRequestInput: CancellationRequestEntryInputList;
    }
  ) {
    super(PROCESS_FEATURE, CANCEL_ORDER_PROCESS_ID);
  }
}

export class CancelOrderFail extends StateUtils.EntityFailAction {
  readonly type = CANCEL_ORDER_FAIL;

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
    super(PROCESS_FEATURE, CANCEL_ORDER_PROCESS_ID, error);
  }
}

export class CancelOrderSuccess extends StateUtils.EntitySuccessAction {
  readonly type = CANCEL_ORDER_SUCCESS;
  constructor() {
    super(PROCESS_FEATURE, CANCEL_ORDER_PROCESS_ID);
  }
}

export class ResetCancelOrderProcess extends StateUtils.EntityLoaderResetAction {
  readonly type = RESET_CANCEL_ORDER_PROCESS;
  constructor() {
    super(PROCESS_FEATURE, CANCEL_ORDER_PROCESS_ID);
  }
}

export type OrderDetailsAction =
  | LoadOrderDetails
  | LoadOrderDetailsFail
  | LoadOrderDetailsSuccess
  | ClearOrderDetails
  | CancelOrder
  | CancelOrderFail
  | CancelOrderSuccess;
