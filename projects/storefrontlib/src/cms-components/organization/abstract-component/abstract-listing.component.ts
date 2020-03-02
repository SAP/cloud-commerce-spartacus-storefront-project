import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
  withLatestFrom,
} from 'rxjs/operators';

import {
  RoutingService,
  B2BSearchConfig,
  θdiff as diff,
  θshallowEqualObjects as shallowEqualObjects,
  RouterState,
  PaginationModel,
  SortModel,
} from '@spartacus/core';

export type ListingModel = {
  values: Array<any>;
  pagination: PaginationModel;
  sorts: SortModel[];
};

export abstract class AbstractListingComponent {
  cxRoute: string;
  data$: Observable<ListingModel>;

  protected queryParams$: Observable<
    B2BSearchConfig
  > = this.routingService.getRouterState().pipe(
    map((routingData: RouterState) => ({
      ...this.defaultQueryParams,
      ...routingData.state.queryParams,
    })),
    distinctUntilChanged(shallowEqualObjects),
    map(this.normalizeQueryParams)
  );

  protected params$: Observable<
    Params
  > = this.routingService
    .getRouterState()
    .pipe(map((routingData: RouterState) => routingData.state.params));

  protected code$: Observable<string> = this.params$.pipe(
    map((params: Params) => params['code'])
  );

  protected defaultQueryParams: B2BSearchConfig = {
    sort: 'byName',
    currentPage: 0,
    pageSize: 5,
  };

  constructor(protected routingService: RoutingService) {}

  changeSortCode(sort: string): void {
    this.updateQueryParams({ sort });
  }

  pageChange(currentPage: number): void {
    this.updateQueryParams({ currentPage });
  }

  protected updateQueryParams(newQueryParams: Partial<B2BSearchConfig>): void {
    this.queryParams$
      .pipe(
        map(queryParams =>
          diff(this.defaultQueryParams, { ...queryParams, ...newQueryParams })
        ),
        withLatestFrom(this.params$),
        take(1)
      )
      .subscribe(
        ([queryParams, params]: [Partial<B2BSearchConfig>, Params]) => {
          this.routingService.go(
            params
              ? {
                  cxRoute: this.cxRoute,
                  params,
                }
              : {
                  cxRoute: this.cxRoute,
                },
            { ...queryParams }
          );
        }
      );
  }

  protected normalizeQueryParams({
    sort,
    currentPage,
    pageSize,
  }): B2BSearchConfig {
    return {
      sort,
      currentPage: parseInt(currentPage, 10),
      pageSize: parseInt(pageSize, 10),
    };
  }
}
