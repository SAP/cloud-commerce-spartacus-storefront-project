import { Injectable, OnDestroy } from '@angular/core';
import {
  ResetCheckoutDeliveryModesEvent,
  ResetCheckoutQueryEvent,
} from '@spartacus/checkout/base/root';
import { EventService } from '@spartacus/core';
import { Subscription } from 'rxjs';
import { PaymentTypeSetEvent } from './checkout-b2b.events';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPaymentTypeEventListener implements OnDestroy {
  protected subscriptions = new Subscription();

  constructor(protected eventService: EventService) {
    this.onPaymentTypeChange();
  }

  protected onPaymentTypeChange(): void {
    this.subscriptions.add(
      this.eventService.get(PaymentTypeSetEvent).subscribe(() => {
        this.eventService.dispatch({}, ResetCheckoutDeliveryModesEvent);
        this.eventService.dispatch({}, ResetCheckoutQueryEvent);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
