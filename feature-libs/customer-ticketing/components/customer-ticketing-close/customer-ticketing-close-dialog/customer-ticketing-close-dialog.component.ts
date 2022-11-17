import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  STATUS,
  STATUS_NAME,
  TicketEvent,
} from '@spartacus/customer-ticketing/root';
import { FormUtils } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { CustomerTicketingDialogComponent } from '../../shared/customer-ticketing-dialog/customer-ticketing-dialog.component';

@Component({
  selector: 'cx-customer-ticketing-close-dialog',
  templateUrl: './customer-ticketing-close-dialog.component.html',
})
export class CustomerTicketingCloseDialogComponent
  extends CustomerTicketingDialogComponent
  implements OnInit, OnDestroy
{
  subscription: Subscription;

  ngOnInit(): void {
    this.buildForm();
  }

  closeRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      FormUtils.deepUpdateValueAndValidity(this.form);
    } else {
      this.isDataLoading$.next(true);
      this.subscription = this.customerTicketingFacade
        .createTicketEvent(this.prepareTicketEvent())
        .subscribe({
          complete: () => {
            this.isDataLoading$.next(false);
            this.close('Ticket closed successfully');
            this.routingService.go({ cxRoute: 'supportTickets' });
          },
          error: () => {
            this.close('Something went wrong while closing the ticket');
          },
        });
    }
  }

  protected prepareTicketEvent(): TicketEvent {
    return {
      message: this.form?.get('message')?.value,
      toStatus: {
        id: STATUS.CLOSED,
        name: STATUS_NAME.CLOSED,
      },
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
