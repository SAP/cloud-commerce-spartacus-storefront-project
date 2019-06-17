import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProductSearchService,
  RoutingService,
  SearchConfig,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { SearchResults } from '../../../navigation';

interface ProductListRouteParams {
  brandCode?: string;
  categoryCode?: string;
  query?: string;
}

interface ProductListQueryParams {
  currentPage?: number;
  pageSize?: number;
  sortCode?: string;
  query?: string;
}

type SearchCriteria = ProductListQueryParams;

@Injectable({ providedIn: 'root' })
export class ProductListComponentService {
  protected defaultPageSize = 10;

  private sub: Subscription;

  private readonly RELEVANCE_CATEGORY = ':relevance:category:';
  private readonly RELEVANCE_BRAND = ':relevance:brand:';

  constructor(
    protected productSearchService: ProductSearchService,
    protected routing: RoutingService,
    protected router: Router
  ) {}

  getSearchResults(): Observable<SearchResults> {
    return this.productSearchService
      .getResults()
      .pipe(filter(searchResult => Object.keys(searchResult).length > 0));
  }

  private getSearchConfig(criteria: SearchCriteria) {
    const result: SearchConfig = {
      currentPage: criteria.currentPage,
      pageSize: criteria.pageSize,
      sortCode: criteria.sortCode,
    };

    // drop empty keys
    Object.keys(result).forEach(key => !result[key] && delete result[key]);

    return result;
  }

  setQuery(query: string) {
    this.mergeQueryParams({ query });
  }

  viewPage(pageNumber: number): void {
    this.mergeQueryParams({ currentPage: pageNumber });
  }

  sort(sortCode: string): void {
    this.mergeQueryParams({ sortCode });
  }

  private mergeQueryParams(queryParams: ProductListQueryParams) {
    this.router.navigateByUrl(
      this.router.createUrlTree([], {
        queryParams,
        queryParamsHandling: 'merge',
      })
    );
  }

  private search(criteria: SearchCriteria): void {
    const query = criteria.query;
    const searchConfig = this.getSearchConfig(criteria);

    this.productSearchService.search(query, searchConfig);
  }

  private getQueryFromRouteParams({
    brandCode,
    categoryCode,
    query,
  }: ProductListRouteParams) {
    if (query) {
      return query;
    }
    if (categoryCode) {
      return this.RELEVANCE_CATEGORY + categoryCode;
    }
    if (brandCode) {
      return this.RELEVANCE_BRAND + brandCode;
    }
  }

  private getCriteriaFromRouting(
    routeParams: ProductListRouteParams,
    queryParams: ProductListQueryParams
  ): SearchCriteria {
    return {
      query: queryParams.query || this.getQueryFromRouteParams(routeParams),
      pageSize: queryParams.pageSize || this.defaultPageSize,
      currentPage: queryParams.currentPage,
      sortCode: queryParams.sortCode,
    };
  }

  // should register on PLP component mounted and unregister on component destroy
  onInit() {
    this.productSearchService.clearResults();

    // // spike todo: avoid changes on routing nextState (maybe use activatedRoute?)
    this.sub = this.routing
      .getRouterState()
      .pipe(
        distinctUntilChanged((x, y) => {
          // router emits new value also when the anticipated `nextState` changes
          // but we want to perform search only when current url changes
          return x.state.url === y.state.url;
        })
      )
      .subscribe(({ state }) => {
        const criteria = this.getCriteriaFromRouting(
          state.params,
          state.queryParams
        );
        this.search(criteria);
      });
  }

  onDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
