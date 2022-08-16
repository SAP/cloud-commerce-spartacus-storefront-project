/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { normalizeHttpError } from '@spartacus/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StockConnector } from '../../connectors/index';
import { StockLevelActions } from '../actions/index';

@Injectable()
export class StockEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly stockConnector: StockConnector
  ) {}

  loadStockLevels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockLevelActions.STOCK_LEVEL),
      map((action: StockLevelActions.StockLevel) => action.payload),
      switchMap(({ productCode, ...location }) =>
        this.stockConnector.loadStockLevels(productCode, location).pipe(
          map(
            (stockLevels) =>
              new StockLevelActions.StockLevelSuccess({
                productCode,
                stockLevels,
              })
          ),
          catchError((error) =>
            of(new StockLevelActions.StockLevelFail(normalizeHttpError(error)))
          )
        )
      )
    )
  );

  loadStockLevelAtStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockLevelActions.STOCK_LEVEL_AT_STORE),
      map(({ payload }: StockLevelActions.StockLevelAtStoreAction) => payload),
      switchMap(({ productCode, storeName }) =>
        this.stockConnector.loadStockLevelAtStore(productCode, storeName).pipe(
          map((stockLevel) =>
            StockLevelActions.StockLevelAtStoreSuccess({
              payload: { productCode, storeName, stockLevel },
            })
          )
        )
      )
    )
  );
}
