import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CancelObj } from '../model/checkout-service-details.model';
import { Order } from '@spartacus/order/root';

@Injectable({
  providedIn: 'root',
})
export abstract class CancelServiceOrderFacade {
  /**
   * Set service schedule DateTime for the order
   *
   * @param scheduledAt a service date time
   */
  abstract cancelService(
    orderCode: string,
    cancelobj: CancelObj
  ): Observable<unknown>;

  /**
   * Retrieves order's details
   */
  abstract loadOrderDetails(): Observable<Order>;
}
