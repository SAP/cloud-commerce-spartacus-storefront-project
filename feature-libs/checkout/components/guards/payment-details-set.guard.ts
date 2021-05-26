import { Injectable, isDevMode } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CheckoutStep, CheckoutStepType } from '@spartacus/checkout/root';
import { RoutingConfigService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutDetailsService } from '../services/checkout-details.service';
import { CheckoutStepService } from '../services/checkout-step.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentDetailsSetGuard implements CanActivate {
  constructor(
    private checkoutDetailsService: CheckoutDetailsService,
    private routingConfigService: RoutingConfigService,
    private router: Router,
    private checkoutStepService: CheckoutStepService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const checkoutStep:
      | CheckoutStep
      | undefined = this.checkoutStepService.getCheckoutStep(
      CheckoutStepType.PAYMENT_DETAILS
    );

    if (!checkoutStep && isDevMode()) {
      console.warn(
        `Missing step with type ${CheckoutStepType.PAYMENT_DETAILS} in checkout configuration.`
      );
    }

    return this.checkoutDetailsService
      .getPaymentDetails()
      .pipe(
        map((paymentDetails) =>
          paymentDetails && Object.keys(paymentDetails).length !== 0
            ? true
            : this.router.parseUrl(
                (checkoutStep &&
                  this.routingConfigService.getRouteConfig(
                    checkoutStep.routeName
                  ).paths?.[0]) as string
              )
        )
      );
  }
}
