/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { MyAccountV2OrderHistoryService } from '@spartacus/order/core';
import { OrderHistoryListView } from '@spartacus/order/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderHistoryComponent } from '../order-history.component';
import { MockDatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { PaginationComponent } from '@spartacus/storefront';
import { MyAccountV2OrderConsolidatedInformationComponent } from './consolidated-information/my-account-v2-order-consolidated-information.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-order-history',
  templateUrl: './my-account-v2-order-history.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    MyAccountV2OrderConsolidatedInformationComponent,
    PaginationComponent,
    RouterLinkActive,
    SpinnerComponent,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class MyAccountV2OrderHistoryComponent extends OrderHistoryComponent {
  protected service = inject(MyAccountV2OrderHistoryService);
  protected readonly ITEMS_PER_PAGE = 5;
  isLoaded$ = new BehaviorSubject<boolean>(false);
  orders$: Observable<OrderHistoryListView | undefined> = this.service
    .getOrderHistoryList(this.ITEMS_PER_PAGE)
    .pipe(
      tap((orders: OrderHistoryListView | undefined) => {
        this.isLoaded$.next(true);
        super.setOrderHistoryParams(orders);
      })
    );
  pageChange(page: number): void {
    this.isLoaded$.next(false);
    this.service.clearOrderList();
    super.pageChange(page);
  }
}
