import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductAdapter } from './product.adapter';
import { UIProduct } from '../../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductConnector {
  constructor(private adapter: ProductAdapter) {}

  get(productCode: string): Observable<UIProduct> {
    return this.adapter.load(productCode);
  }
}
