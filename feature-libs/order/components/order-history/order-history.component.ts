/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Params, RouterLink, RouterLinkActive } from '@angular/router';
import {
  isNotUndefined,
  RoutingService,
  TranslationService,
} from '@spartacus/core';
import {
  Order,
  OrderHistoryFacade,
  OrderHistoryList,
  ReplenishmentOrderHistoryFacade,
} from '@spartacus/order/root';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { NgIf, NgClass, NgFor, AsyncPipe } from '@angular/common';
import { SortingComponent } from '../../../../projects/storefrontlib/shared/components/list-navigation/sorting/sorting.component';
import { PaginationComponent } from '../../../../projects/storefrontlib/shared/components/list-navigation/pagination/pagination.component';
import { UrlPipe } from '../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { CxDatePipe } from '../../../../projects/core/src/i18n/date.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { MockDatePipe } from '../../../../projects/core/src/i18n/testing/mock-date.pipe';

@Component({
  selector: 'cx-order-history',
  templateUrl: './order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgClass,
    SortingComponent,
    PaginationComponent,
    NgFor,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class OrderHistoryComponent implements OnDestroy {
  constructor(
    protected routing: RoutingService,
    protected orderHistoryFacade: OrderHistoryFacade,
    protected translation: TranslationService,
    protected replenishmentOrderHistoryFacade: ReplenishmentOrderHistoryFacade
  ) {}

  private PAGE_SIZE = 5;
  sortType: string;
  hasPONumber: boolean | undefined;

  orders$: Observable<OrderHistoryList | undefined> = this.orderHistoryFacade
    .getOrderHistoryList(this.PAGE_SIZE)
    .pipe(
      tap((orders: OrderHistoryList | undefined) => {
        this.setOrderHistoryParams(orders);
      })
    );

  setOrderHistoryParams(orders: OrderHistoryList | undefined) {
    if (orders?.pagination?.sort) {
      this.sortType = orders.pagination.sort;
    }
    this.hasPONumber = orders?.orders?.[0]?.purchaseOrderNumber !== undefined;
  }

  hasReplenishmentOrder$: Observable<boolean> =
    this.replenishmentOrderHistoryFacade
      .getReplenishmentOrderDetails()
      .pipe(map((order) => order && Object.keys(order).length !== 0));

  isLoaded$: Observable<boolean> =
    this.orderHistoryFacade.getOrderHistoryListLoaded();

  /**
   * When "Order Return" feature is enabled, this component becomes one tab in
   * TabParagraphContainerComponent. This can be read from TabParagraphContainer.
   */
  tabTitleParam$: Observable<number> = this.orders$.pipe(
    map((order) => order?.pagination?.totalResults),
    filter(isNotUndefined),
    take(1)
  );

  ngOnDestroy(): void {
    this.orderHistoryFacade.clearOrderList();
  }

  changeSortCode(sortCode: string): void {
    const event: { sortCode: string; currentPage: number } = {
      sortCode,
      currentPage: 0,
    };
    this.sortType = sortCode;
    this.fetchOrders(event);
  }

  pageChange(page: number): void {
    const event: { sortCode: string; currentPage: number } = {
      sortCode: this.sortType,
      currentPage: page,
    };
    this.fetchOrders(event);
  }

  goToOrderDetail(order: Order): void {
    this.routing.go(
      {
        cxRoute: 'orderDetails',
        params: order,
      },
      {
        queryParams: this.getQueryParams(order),
      }
    );
  }

  getQueryParams(order: Order): Params | null {
    return this.orderHistoryFacade.getQueryParams(order);
  }

  getSortLabels(): Observable<{ byDate: string; byOrderNumber: string }> {
    return combineLatest([
      this.translation.translate('sorting.date'),
      this.translation.translate('sorting.orderNumber'),
    ]).pipe(
      map(([textByDate, textByOrderNumber]) => {
        return {
          byDate: textByDate,
          byOrderNumber: textByOrderNumber,
        };
      })
    );
  }

  private fetchOrders(event: { sortCode: string; currentPage: number }): void {
    this.orderHistoryFacade.loadOrderList(
      this.PAGE_SIZE,
      event.currentPage,
      event.sortCode
    );
  }
}
