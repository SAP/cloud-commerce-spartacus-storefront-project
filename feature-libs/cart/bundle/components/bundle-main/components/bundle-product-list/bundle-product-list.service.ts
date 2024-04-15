/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BundleService } from '@spartacus/cart/bundle/core';
import {
  ActivatedRouterStateSnapshot,
  CurrencyService,
  LanguageService,
  Product,
  ProductSearchPage,
  RoutingService
} from '@spartacus/core';
import { SearchCriteria, ViewConfig } from '@spartacus/storefront';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  tap,
  using
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BundleProductListComponentService {
  constructor(
    protected config: ViewConfig,
    protected routing: RoutingService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected currencyService: CurrencyService,
    protected languageService: LanguageService,
    protected bundleService: BundleService,
  ) {}

  readonly availableEntities$: Observable<ProductSearchPage> = using(
    () => this.searchByRouting$.subscribe(),
    () => this.availableEntriesEntities$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  protected availableEntriesEntities$: Observable<ProductSearchPage> =
    this.bundleService
      .getAvailableEntriesEntities()
      .pipe(filter((entities) => Object.keys(entities).length > 0));

  protected searchByRouting$: Observable<ActivatedRouterStateSnapshot> =
    combineLatest([
      this.routing.getRouterState().pipe(
        distinctUntilChanged((x, y) => x.state.url === y.state.url)
      ),
      ...this.siteContext,
    ]).pipe(
      debounceTime(0),
      map(([routerState, ..._context]) => routerState.state),
      tap((state: ActivatedRouterStateSnapshot) => {
        if (state.context.id === 'bundleSearch') {
          const entryGroupNumber = state.params['entryGroupNumber'];
          if (entryGroupNumber) {
            const criteria = this.getCriteriaFromRoute(
              state.params,
              state.queryParams
            );
            this.search(entryGroupNumber, criteria);
          }
        }
      })
    );

  /**
   * Performs a search based on the given search criteria.
   *
   * The search is delegated to the `ProductSearchService`.
   */
  protected search(entryGroupNumber: number, criteria: SearchCriteria): void {
    const currentPage = criteria.currentPage;
    const pageSize = criteria.pageSize;
    const sort = criteria.sortCode;

    this.bundleService.getAllowedProducts(entryGroupNumber, criteria.query, {
      pageSize,
      currentPage,
      sort,
    });
  }

  /**
   * Expose the `SearchCriteria`. The search criteria are driven by the route parameters.
   *
   * This search route configuration is not yet configurable
   * (see https://github.com/SAP/spartacus/issues/7191).
   */
  protected getCriteriaFromRoute(
    routeParams: any,
    queryParams: SearchCriteria
  ): SearchCriteria {
    return {
      query: queryParams.query || routeParams['query'],
      pageSize: queryParams.pageSize || this.config.view?.defaultPageSize,
      currentPage: queryParams.currentPage,
      sortCode: queryParams.sortCode,
    };
  }

  /**
   * The site context is used to update the search query in case of a
   * changing context. The context will typically influence the search data.
   *
   * We keep this private for now, as we're likely refactoring this in the next
   * major version.
   */
  private get siteContext(): Observable<string>[] {
    return [this.languageService.getActive(), this.currencyService.getActive()];
  }

  /**
   * Sort the search results by the given sort code.
   */
  sort(sortCode: string): void {
    this.route({ sortCode });
  }

  /**
   * Routes to the next product listing page, using the given `queryParams`. The
   * `queryParams` support sorting, pagination and querying.
   *
   * The `queryParams` are delegated to the Angular router `NavigationExtras`.
   */
  protected route(queryParams: SearchCriteria): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }

  checkDetails(product: Product): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { productCode: product.code },
      queryParamsHandling: 'merge',
    });
  }
}
