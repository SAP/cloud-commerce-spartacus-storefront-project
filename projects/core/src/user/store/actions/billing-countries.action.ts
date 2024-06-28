/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import {
  ActionErrorProperty,
  ErrorAction,
} from '../../../error-handling/effects-error-handler/error-action';

export const LOAD_BILLING_COUNTRIES = '[User] Load Billing Countries';
export const LOAD_BILLING_COUNTRIES_FAIL = '[User] Load Billing Countries Fail';
export const LOAD_BILLING_COUNTRIES_SUCCESS =
  '[User] Load Billing Countries Success';

export class LoadBillingCountries implements Action {
  readonly type = LOAD_BILLING_COUNTRIES;
  constructor() {
    // Intentional empty constructor
  }
}

export class LoadBillingCountriesFail implements ErrorAction {
  readonly type = LOAD_BILLING_COUNTRIES_FAIL;

  constructor(error: ActionErrorProperty);
  /**
   * @deprecated Please use the `error` parameter with a non-null, non-undefined value.
   *             Support for `null` or `undefined` will be removed in future versions,
   *             along with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing deprecated constructor
    error: any
  );
  constructor(public error: any) {}
}

export class LoadBillingCountriesSuccess implements Action {
  readonly type = LOAD_BILLING_COUNTRIES_SUCCESS;
  constructor(public payload: any) {}
}

export type BillingCountriesAction =
  | LoadBillingCountries
  | LoadBillingCountriesFail
  | LoadBillingCountriesSuccess;
