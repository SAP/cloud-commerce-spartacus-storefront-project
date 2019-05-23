import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoutingService, CheckoutService } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class OrderConfirmationPageGuard implements CanActivate {
  constructor(
    private checkoutService: CheckoutService,
    private routingService: RoutingService
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkoutService.getOrderDetails().pipe(
      map(orderDetails => {
        if (orderDetails && Object.keys(orderDetails).length !== 0) {
          return true;
        } else {
          this.routingService.go({ cxRoute: 'orders' });
          return false;
        }
      })
    );
  }
}
