/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import { ActionErrorProperty } from '@spartacus/core';
import { Region } from '../../../model/address.model';
import { StateUtils } from '../../../state/utils/index';
import { REGIONS } from '../user-state';

export const LOAD_REGIONS = '[User] Load Regions';
export const LOAD_REGIONS_SUCCESS = '[User] Load Regions Success';
export const LOAD_REGIONS_FAIL = '[User] Load Regions Fail';
export const CLEAR_REGIONS = '[User] Clear Regions';

export class LoadRegions extends StateUtils.LoaderLoadAction {
  readonly type = LOAD_REGIONS;

  constructor(public payload: string) {
    super(REGIONS);
  }
}

export class LoadRegionsFail extends StateUtils.LoaderFailAction {
  readonly type = LOAD_REGIONS_FAIL;

  /**
   * @deprecated Please use `error` parameter other than `null` or `undefined`.
   *
   *             Note: Allowing for `null` or `undefined` will be removed in future versions
   *             together with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   **/
  constructor(error: null | undefined);
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing non-deprecated constructor
    error: ActionErrorProperty
  );
  constructor(public error: any) {
    super(REGIONS, error);
  }
}

export class LoadRegionsSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = LOAD_REGIONS_SUCCESS;

  constructor(public payload: { entities: Region[]; country: string }) {
    super(REGIONS);
  }
}

export class ClearRegions implements Action {
  readonly type = CLEAR_REGIONS;

  constructor() {
    // Intentional empty constructor
  }
}

export type RegionsAction =
  | LoadRegions
  | LoadRegionsFail
  | LoadRegionsSuccess
  | ClearRegions;
