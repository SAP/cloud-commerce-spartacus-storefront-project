/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  EventService,
  RoutingService,
  TranslationService,
} from '@spartacus/core';
import {
  STATUS,
  TEXT_COLOR_CLASS,
  TicketDetails,
  DATE_FORMAT,
  CustomerTicketingFacade,
  GetTicketQueryReloadEvent,
} from '@spartacus/customer-ticketing/root';
import { Card } from '@spartacus/storefront';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-customer-ticketing-details',
  templateUrl: './customer-ticketing-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTicketingDetailsComponent implements OnDestroy {
  dateFormat = DATE_FORMAT;
  subscription = new Subscription();
  ticketDetails$: Observable<TicketDetails | undefined> =
    this.customerTicketingFacade.getTicket();

  constructor(
    protected translation: TranslationService,
    protected customerTicketingFacade: CustomerTicketingFacade,
    protected routingService: RoutingService,
    protected eventService: EventService
  ) {
    this.reloadOnRedirection();
  }

  prepareCardContent(
    entity: string,
    titleTranslation: string,
    id?: string
  ): Observable<Card> {
    return this.translation.translate(titleTranslation).pipe(
      filter(() => Boolean(entity)),
      map((textTitle) => ({
        title: textTitle,
        text: [entity],
        customClass: this.getStatusClass(id?.toUpperCase()),
      }))
    );
  }

  getStatusClass(id?: string): string {
    return id === STATUS.OPEN || id === STATUS.INPROCESS
      ? TEXT_COLOR_CLASS.GREEN
      : id === STATUS.CLOSED
      ? TEXT_COLOR_CLASS.GREY
      : '';
  }

  protected reloadOnRedirection() {
    this.subscription = combineLatest([
      this.ticketDetails$,
      this.routingService.getParams().pipe(map((params) => params.ticketCode)),
    ])
      .pipe(
        take(1),
        tap(([ticket, ticketCode]) => {
          if (ticketCode !== ticket?.id) {
            this.eventService.dispatch({}, GetTicketQueryReloadEvent);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
