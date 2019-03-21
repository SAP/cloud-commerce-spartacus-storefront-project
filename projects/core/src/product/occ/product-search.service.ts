import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SearchConfig } from '../model/search-config';
import { DynamicTemplate } from '../../config/utils/dynamic-template';
import {
  SuggestionList,
  ProductSearchPage
} from '../../occ/occ-models/occ.models';

import { OccProductConfig } from '../config/product-config';
import { ProductOccService } from './product-occ.service';

const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  pageSize: 20
};

@Injectable()
export class ProductSearchLoaderService extends ProductOccService {
  constructor(private http: HttpClient, private config: OccProductConfig) {
    super(config);
  }

  loadSearch(
    fullQuery: string,
    searchConfig: SearchConfig = DEFAULT_SEARCH_CONFIG
  ): Observable<ProductSearchPage> {
    return this.http
      .get(this.getSearchEndpoint(fullQuery, searchConfig))
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  loadSuggestions(term: string, pageSize = 3): Observable<SuggestionList> {
    return this.http
      .get(this.getSuggestionEndpoint(term, pageSize.toString()))
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  protected getSearchEndpoint(
    query: string,
    searchConfig: SearchConfig
  ): string {
    let params = new HttpParams();
    let url =
      this.getProductEndpoint() +
      DynamicTemplate.resolve(this.config.endpoints.productSearch, {
        query
      });

    if (searchConfig.pageSize) {
      params = params.set('pageSize', searchConfig.pageSize.toString());
    }
    if (searchConfig.currentPage) {
      params = params.set('currentPage', searchConfig.currentPage.toString());
    }
    if (searchConfig.sortCode) {
      params = params.set('sort', searchConfig.sortCode);
    }

    return (url += `&${params.toString()}`);
  }

  protected getSuggestionEndpoint(term: string, max: string): string {
    return (
      this.getProductEndpoint() +
      DynamicTemplate.resolve(this.config.endpoints.productSuggestions, {
        term,
        max
      })
    );
  }
}
