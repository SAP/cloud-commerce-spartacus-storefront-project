import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SemanticPathService } from '@spartacus/core';
import { UnnamedFacade } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderConfirmationGuard implements CanActivate {
  constructor(
    protected checkoutFacade: UnnamedFacade,
    protected router: Router,
    protected semanticPathService: SemanticPathService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkoutFacade.getOrderDetails().pipe(
      map((orderDetails) => {
        if (orderDetails && Object.keys(orderDetails).length !== 0) {
          return true;
        } else {
          return this.router.parseUrl(this.semanticPathService.get('orders'));
        }
      })
    );
  }
}
