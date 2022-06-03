import { Injectable, OnDestroy } from '@angular/core';
import {
  EventService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { Subscription } from 'rxjs';
import { CommerceQuotesListReloadQueryEvent } from './commerce-quotes-list.events';

@Injectable({
  providedIn: 'root',
})
export class CommerceQuotesListEventListener implements OnDestroy {
  protected subscriptions = new Subscription();

  constructor(
    protected eventService: EventService,
    protected globalMessageService: GlobalMessageService
  ) {
    this.onQuoteListReload();
  }

  protected onQuoteListReload(): void {
    this.subscriptions.add(
      this.eventService
        .get(CommerceQuotesListReloadQueryEvent)
        .subscribe(() => {
          this.globalMessageService.add(
            { key: 'sorting.pageViewUpdated' },
            GlobalMessageType.MSG_TYPE_ASSISTIVE,
            500
          );
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
