import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { map, tap, filter, take } from 'rxjs/operators';

@Injectable()
export class ProductService {
  constructor(private store: Store<fromStore.ProductsState>) {}

  get(productCode: string): Observable<any> {
    return this.store.pipe(
      select(fromStore.getSelectedProductFactory(productCode))
    );
  }

  isProductLoaded(requestedProductCode: string): Observable<boolean> {
    let tryTimes = 0;
    return this.store.pipe(
      select(fromStore.getSelectedProductFactory(requestedProductCode)),
      map(product => {
        if (product) {
          return Object.keys(product).length !== 0;
        } else {
          return false;
        }
      }),
      tap(found => {
        if (!found) {
          tryTimes++;
          this.store.dispatch(new fromStore.LoadProduct(requestedProductCode));
        }
      }),
      filter(found => found || tryTimes === 3),
      take(1)
    );
  }
}
