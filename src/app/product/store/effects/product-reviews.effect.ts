import { OccProductService } from './../../../newocc/product/product.service';

import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as productReviewsActions from './../actions/product-reviews.action';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProductReviewsEffects {
  @Effect()
  loadProductReviews$ = this.actions$
    .ofType(productReviewsActions.LOAD_PRODUCT_REVIEWS)
    .pipe(
      map((action: productReviewsActions.LoadProductReviews) => action.payload),
      mergeMap(productCode => {
        return this.occProductService.loadProductReviews(productCode).pipe(
          map(data => {
            return new productReviewsActions.LoadProductReviewsSuccess({
              productCode,
              list: data.reviews
            });
          }),
          catchError(error =>
            of(
              new productReviewsActions.LoadProductReviewsFail({
                productCode,
                error
              })
            )
          )
        );
      })
    );

  constructor(
    private actions$: Actions,
    private occProductService: OccProductService
  ) {}
}
