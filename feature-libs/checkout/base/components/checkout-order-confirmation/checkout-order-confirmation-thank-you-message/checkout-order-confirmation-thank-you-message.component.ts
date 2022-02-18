import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CheckoutFacade } from '@spartacus/checkout/base/root';
import { Order } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cx-order-confirmation-thank-you-message',
  templateUrl: './checkout-order-confirmation-thank-you-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderConfirmationThankYouMessageComponent
  implements OnInit, OnDestroy
{
  order$: Observable<Order | undefined>;

  isGuestCustomer = false;
  orderGuid: string | undefined;

  constructor(protected checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.order$ = this.checkoutFacade.getOrderDetails().pipe(
      tap((order) => {
        this.isGuestCustomer =
          order && 'guestCustomer' in order
            ? order.guestCustomer ?? false
            : false;
        this.orderGuid = order?.guid;
      })
    );
  }

  ngOnDestroy() {
    this.checkoutFacade.clearOrder();
  }
}
