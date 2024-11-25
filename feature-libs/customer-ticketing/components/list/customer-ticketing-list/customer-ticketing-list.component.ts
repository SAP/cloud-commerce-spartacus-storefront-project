/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { RoutingService, TranslationService } from '@spartacus/core';
import {
  CustomerTicketingConfig,
  CustomerTicketingFacade,
  STATUS,
  TEXT_COLOR_CLASS,
  TicketList,
} from '@spartacus/customer-ticketing/root';
import { ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { SortingComponent } from '@spartacus/storefront';
import { CustomerTicketingCreateComponent } from '../customer-ticketing-create/customer-ticketing-create.component';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@spartacus/storefront';
import { SpinnerComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { MockDatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-customer-ticketing-list',
  templateUrl: './customer-ticketing-list.component.html',
  imports: [
    NgIf,
    SortingComponent,
    CustomerTicketingCreateComponent,
    NgFor,
    RouterLink,
    NgClass,
    PaginationComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    CxDatePipe,
    UrlPipe,
    TranslatePipe,
    MockDatePipe,
  ],
})
export class CustomerTicketingListComponent {
  constructor(
    protected customerTicketingFacade: CustomerTicketingFacade,
    protected routingService: RoutingService,
    protected translationService: TranslationService,
    protected customerTicketingConfig: CustomerTicketingConfig
  ) {}
  PAGE_SIZE =
    this.customerTicketingConfig.customerTicketing?.listViewPageSize || 5;
  sortType: string;
  iconTypes = ICON_TYPE;
  tickets$: Observable<TicketList | undefined> = this.customerTicketingFacade
    .getTickets(this.PAGE_SIZE)
    .pipe(tap((tickets) => (this.sortType = tickets?.pagination?.sort || '')));

  goToTicketDetail(ticketId: string | undefined): void {
    this.routingService.go({
      cxRoute: 'supportTicketDetails',
      params: { ticketCode: ticketId },
    });
  }

  getSortLabels(): Observable<{ byTicketId: string; byDate: string }> {
    return combineLatest([
      this.translationService.translate('customerTicketing.ticketId'),
      this.translationService.translate('customerTicketing.changedOn'),
    ]).pipe(
      map(([textByTicketId, textByDate]) => {
        return {
          byTicketId: textByTicketId,
          byDate: textByDate,
        };
      })
    );
  }

  changeSortCode(sortCode: string): void {
    this.sortType = sortCode;
    this.pageChange(0);
  }

  pageChange(page: number): void {
    const ticketListParams = this.createTicketListEvent(this.sortType, page);
    this.fetchTicketList(ticketListParams);
  }

  createTicketListEvent(
    sortCode: string,
    currentPage: number
  ): { currentPage: number; sortCode: string } {
    return {
      currentPage: currentPage,
      sortCode: sortCode,
    };
  }

  private fetchTicketList(ticketListParams: {
    sortCode: string;
    currentPage: number;
  }): void {
    this.tickets$ = this.customerTicketingFacade.getTickets(
      this.PAGE_SIZE,
      ticketListParams.currentPage,
      ticketListParams.sortCode
    );
  }

  getStatusClass = (status: string): string => {
    switch (status) {
      case STATUS.OPEN:
      case STATUS.INPROCESS:
        return TEXT_COLOR_CLASS.GREEN;
      case STATUS.CLOSED:
        return TEXT_COLOR_CLASS.GREY;
      default:
        return '';
    }
  };
}
