import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckoutDetailsService } from '../services/checkout-details.service';

/**
 * @deprecated since 4.0, it is not used any more.
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutDetailsLoadedGuard implements CanActivate {
  constructor(private checkoutDetailsService: CheckoutDetailsService) {}

  canActivate(): Observable<boolean> {
    return this.checkoutDetailsService.getCheckoutDetailsLoaded$;
  }
}
