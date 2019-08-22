import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';
import { RoutingConfigService } from '@spartacus/core';
import { ExpressCheckoutService } from '../services/express-checkout.service';
import { switchMap } from 'rxjs/operators';
import { CheckoutConfigService } from '../services/checkout-config.service';
import { CheckoutStepType } from '../model/checkout-step.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  firstStep$: Observable<UrlTree>;

  constructor(
    private router: Router,
    private checkoutConfigService: CheckoutConfigService,
    private routingConfigService: RoutingConfigService,
    private expressCheckoutService: ExpressCheckoutService
  ) {
    this.firstStep$ = of(
      this.router.parseUrl(
        this.routingConfigService.getRouteConfig(
          this.checkoutConfigService.getFirstCheckoutStepRoute()
        ).paths[0]
      )
    );
  }

  canActivate(): Observable<boolean | UrlTree> {
    if (this.checkoutConfigService.isExpressCheckout()) {
      return this.expressCheckoutService.trySetDefaultCheckoutDetails().pipe(
        switchMap((expressCheckoutPossible: boolean) => {
          return expressCheckoutPossible
            ? of(
                this.router.parseUrl(
                  this.routingConfigService.getRouteConfig(
                    this.checkoutConfigService.getCheckoutStepRoute(
                      CheckoutStepType.REVIEW_ORDER
                    )
                  ).paths[0]
                )
              )
            : this.firstStep$;
        })
      );
    } else {
      return this.firstStep$;
    }
  }
}
