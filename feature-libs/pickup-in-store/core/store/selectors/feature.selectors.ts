/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import {
  PICKUP_LOCATIONS_FEATURE,
  PickupLocationsState,
  StateWithPickupLocations,
} from '../pickup-location-state';
import {
  PICKUP_OPTION_FEATURE,
  PickupOptionState,
  StateWithPickupOption,
} from '../pickup-option-state';
import { StateWithStock, STOCK_FEATURE, StockState } from '../stock-state';

export const getPickupLocationsState: MemoizedSelector<
  StateWithPickupLocations,
  PickupLocationsState
> = createFeatureSelector<PickupLocationsState>(PICKUP_LOCATIONS_FEATURE);

export const getPickupOptionState: MemoizedSelector<
  StateWithPickupOption,
  PickupOptionState
> = createFeatureSelector<PickupOptionState>(PICKUP_OPTION_FEATURE);

export const getStockState: MemoizedSelector<StateWithStock, StockState> =
  createFeatureSelector<StockState>(STOCK_FEATURE);
