import { Component, inject } from '@angular/core';
import {
  CustomerTicketingFacade,
  TicketList,
} from '@spartacus/customer-ticketing/root';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-myaccount-view-customer-ticketing',
  templateUrl: './myaccount-view-customer-ticketing.component.html',
})
export class MyAccountViewCustomerTicketingComponent {
  private PAGE_SIZE = 1;
  protected customerTicketingFacade = inject(CustomerTicketingFacade);
  tickets$: Observable<TicketList | undefined> =
    this.customerTicketingFacade.getTickets(this.PAGE_SIZE);
}
