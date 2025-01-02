/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchConfig } from '../../model/search-config';

import { Observable } from 'rxjs';
import { Product } from '../../../model';
import {
    ProductSearchPage,
    Suggestion,
} from '../../../model/product-search.model';

export abstract class ProductSearchAdapter {
  abstract search(
    query: string,
    searchConfig?: SearchConfig,
    scope?: string
  ): Observable<ProductSearchPage>;

  abstract searchByCodes(
    codes: string[],
    scope?: string
  ): Observable<{ products: Product[] }>;

  abstract searchByCategory(
    category: string,
    scope?: string
  ): Observable<{ products: Product[] }>;

  abstract loadSuggestions(
    term: string,
    pageSize?: number
  ): Observable<Suggestion[]>;
}
