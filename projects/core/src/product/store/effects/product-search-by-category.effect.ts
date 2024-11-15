/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AuthActions } from '../../../auth/user-auth/store/actions';
import { normalizeHttpError } from '../../../util/normalize-http-error';
import { Observable } from 'rxjs';
import { catchError, groupBy, map, mergeMap, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../logger/logger.service';
import { SiteContextActions } from '../../../site-context/store/actions/index';
import { bufferDebounceTime } from '../../../util/rxjs/buffer-debounce-time';
import { withdrawOn } from '../../../util/rxjs/withdraw-on';
import { ProductSearchConnector } from '../../connectors/search/product-search.connector';
import { ProductActions } from '../actions/index';

@Injectable()
export class ProductSearchByCategoryEffects {
  protected logger = inject(LoggerService);
  private actions$ = inject(Actions);
  private productSearchConnector = inject(ProductSearchConnector);

  private contextChange$: Observable<Action> = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  searchByCategory$ = createEffect(
    () =>
      ({ scheduler, debounce = 0 } = {}): Observable<
        | ProductActions.ProductSearchLoadByCategorySuccess
        | ProductActions.ProductSearchLoadByCategoryFail
      > =>
        this.actions$.pipe(
          ofType(ProductActions.PRODUCT_SEARCH_LOAD_BY_CATEGORY),

          groupBy(
            (action: ProductActions.ProductSearchLoadByCategory) =>
              action.payload.scope
          ),
          mergeMap((group) => {
            const scope = group.key;

            return group.pipe(
              map(
                (action: ProductActions.ProductSearchLoadByCategory) =>
                  action.payload
              ),

              bufferDebounceTime(debounce, scheduler),

              mergeMap((payloads: { categoryCode: string; scope: string }[]) => {
                const categoryCodes = payloads.map(
                  (payload) => payload.categoryCode
                );

                return this.productSearchConnector
                  .searchByCategory(categoryCodes[0], scope)
                  .pipe(
                    switchMap(
                      (
                        searchResults
                      ): ProductActions.ProductSearchLoadByCategorySuccess[] => {
                        return searchResults.products?.map(
                          (product, index) =>
                            // constructor(payload: { products: Product[]; categoryCode: string; scope: string }) {
                            new ProductActions.ProductSearchLoadByCategorySuccess({
                              ...payloads[index],
                             products: [product],
                            })
                        );
                      }
                    ),
                    catchError(
                      (
                        error
                      ): ProductActions.ProductSearchLoadByCategoryFail[] => {
                        return payloads.map(
                          (payload) =>
                            new ProductActions.ProductSearchLoadByCategoryFail({
                              ...payload,
                              error: normalizeHttpError(error, this.logger),
                            })
                        );
                      }
                    )
                  );
              })
            );
          }),
          withdrawOn(this.contextChange$)
        )
  );

  clearState$: Observable<ProductActions.ClearProductSearchByCategoryState> =
    createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT, AuthActions.LOGIN),
        map(() => new ProductActions.ClearProductSearchByCategoryState())
      )
    );
}
