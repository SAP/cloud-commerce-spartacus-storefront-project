import { Injectable, OnDestroy } from '@angular/core';
import {
  CurrencySetEvent,
  EventService,
  LanguageSetEvent,
  LoginEvent,
  LogoutEvent,
} from '@spartacus/core';
import { merge, Subscription } from 'rxjs';
import {
  GetTicketAssociatedObjectsQueryReloadEvent,
  GetTicketAssociatedObjectsQueryResetEvent,
  GetTicketCatQueryReloadEvent,
  GetTicketCatQueryResetEvent,
  GetTicketQueryReloadEvent,
  GetTicketQueryResetEvent,
} from './customer-ticketing.events';

@Injectable({
  providedIn: 'root',
})
export class CustomerTicketingEventListener implements OnDestroy {
  protected subscriptions = new Subscription();

  constructor(protected eventService: EventService) {
    this.onGetTicketQueryReload();
    this.onGetTicketQueryReset();
  }

  protected onGetTicketQueryReload(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LanguageSetEvent),
        this.eventService.get(CurrencySetEvent)
      ).subscribe(() => {
        this.eventService.dispatch({}, GetTicketQueryReloadEvent);
      })
    );
  }

  protected onGetTicketQueryReset(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LogoutEvent),
        this.eventService.get(LoginEvent)
      ).subscribe(() => {
        this.eventService.dispatch({}, GetTicketQueryResetEvent);
      })
    );
  }

  protected onGetTicketCatQueryReset(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LogoutEvent),
        this.eventService.get(LoginEvent)
      ).subscribe(() => {
        this.eventService.dispatch({}, GetTicketCatQueryResetEvent);
      })
    );
  }

  protected onGetTicketCatQueryReload(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LogoutEvent),
        this.eventService.get(LoginEvent)
      ).subscribe(() => {
        this.eventService.dispatch({}, GetTicketCatQueryReloadEvent);
      })
    );
  }

  protected onGetTicketAssociatedObjectsQueryReset(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LogoutEvent),
        this.eventService.get(LoginEvent)
      ).subscribe(() => {
        this.eventService.dispatch(
          {},
          GetTicketAssociatedObjectsQueryResetEvent
        );
      })
    );
  }

  protected onGetTicketAssociatedObjectsQueryReload(): void {
    this.subscriptions.add(
      merge(
        this.eventService.get(LogoutEvent),
        this.eventService.get(LoginEvent)
      ).subscribe(() => {
        this.eventService.dispatch(
          {},
          GetTicketAssociatedObjectsQueryReloadEvent
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
