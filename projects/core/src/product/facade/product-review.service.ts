import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Review } from '../../model/product.model';
import * as fromStore from '../store/index';

@Injectable()
export class ProductReviewService {
  constructor(protected store: Store<fromStore.StateWithProduct>) {}

  getByProductCode(productCode: string): Observable<Review[]> {
    const selector = fromStore.getSelectedProductReviewsFactory(productCode);
    return this.store.pipe(
      select(selector),
      tap(reviews => {
        if (reviews === undefined && productCode !== undefined) {
          this.store.dispatch(new fromStore.LoadProductReviews(productCode));
        }
      })
    );
  }

  add(productCode: string, review: Review): void {
    this.store.dispatch(
      new fromStore.PostProductReview({
        productCode: productCode,
        review,
      })
    );
  }
}
