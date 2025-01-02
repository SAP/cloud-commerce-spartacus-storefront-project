/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../model';
import {
  ProductSearchPage,
  Suggestion,
} from '../../../model/product-search.model';
import { SearchConfig } from '../../model/search-config';
import { ProductSearchAdapter } from './product-search.adapter';

@Injectable({
  providedIn: 'root',
})
export class ProductSearchConnector {
  constructor(protected adapter: ProductSearchAdapter) {}

  search(
    query: string,
    searchConfig?: SearchConfig,
    scope?: string
  ): Observable<ProductSearchPage> {
    return this.adapter.search(query, searchConfig, scope);
  }

  searchByCodes(
    codes: string[],
    scope?: string
  ): Observable<{ products: Product[] }> {
    return this.adapter.searchByCodes(codes, scope);
  }

  searchByCategory(
    category: string,
    scope?: string
  ): Observable<{ products: Product[] }> {
    return this.adapter.searchByCategory(category, scope);
  }

  getSuggestions(term: string, pageSize?: number): Observable<Suggestion[]> {
    return this.adapter.loadSuggestions(term, pageSize);
  }
}
