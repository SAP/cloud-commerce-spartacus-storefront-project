import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SemanticPathService } from '@spartacus/core';
import { OrderDetailsService } from '@spartacus/order/components';
// import { OrderFacade } from '@spartacus/order/root';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderGuard {
  constructor(
    protected orderDetailsService: OrderDetailsService,
    protected router: Router,
    protected semanticPathService: SemanticPathService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.orderDetailsService.getOrderDetails().pipe(
      map((orderDetails) => {
        console.log('Order details: ', orderDetails);
        if (orderDetails && Object.keys(orderDetails).length !== 0) {
          return true;
        } else {
          return true;
          return this.router.parseUrl(
            this.semanticPathService.get('orders') ?? ''
          );
        }
      })
    );
  }
}


