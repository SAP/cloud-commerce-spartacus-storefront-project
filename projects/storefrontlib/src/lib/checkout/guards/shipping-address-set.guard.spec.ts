import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import {
  Order,
  ServerConfig,
  RoutingConfigService,
  RoutesConfig,
} from '@spartacus/core';
import { ShippingAddressSetGuard } from './shipping-address-set.guard';
import { defaultCheckoutConfig } from '../config/default-checkout-config';
import { CheckoutDetailsService } from '../services/checkout-details.service';
import { CheckoutConfig } from '../config/checkout-config';
import { defaultStorefrontRoutesConfig } from '../../ui/pages/default-routing-config';

const MockRoutesConfig: RoutesConfig = defaultStorefrontRoutesConfig;

class MockCheckoutDetailsService {
  getDeliveryAddress(): Observable<Order> {
    return of(null);
  }
}

class MockRoutingConfigService {
  getRouteConfig(routeName: string) {
    return MockRoutesConfig[routeName];
  }
}

const MockCheckoutConfig: CheckoutConfig = defaultCheckoutConfig;
const MockServerConfig: ServerConfig = { production: false };

describe(`ShippingAddressSetGuard`, () => {
  let guard: ShippingAddressSetGuard;
  let mockCheckoutDetailsService: MockCheckoutDetailsService;
  let mockCheckoutConfig: CheckoutConfig;
  let mockRoutingConfigService: RoutingConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CheckoutDetailsService,
          useClass: MockCheckoutDetailsService,
        },
        { provide: CheckoutConfig, useValue: MockCheckoutConfig },
        { provide: ServerConfig, useValue: MockServerConfig },
        { provide: RoutingConfigService, useClass: MockRoutingConfigService },
      ],
      imports: [RouterTestingModule],
    });

    guard = TestBed.get(ShippingAddressSetGuard);
    mockCheckoutDetailsService = TestBed.get(CheckoutDetailsService);
    mockCheckoutConfig = TestBed.get(CheckoutConfig);
    mockRoutingConfigService = TestBed.get(RoutingConfigService);
  });

  describe(`when there is NO shipping address present`, () => {
    it(`should navigate to shipping address step`, done => {
      spyOn(mockCheckoutDetailsService, 'getDeliveryAddress').and.returnValue(
        of({})
      );

      guard.canActivate().subscribe(result => {
        expect(result.toString()).toEqual(
          '/' +
            mockRoutingConfigService.getRouteConfig(
              MockCheckoutConfig.checkout.steps[0].route
            ).paths[0]
        );
        done();
      });
    });

    it(`should navigate to default if not configured`, done => {
      spyOn(mockCheckoutDetailsService, 'getDeliveryAddress').and.returnValue(
        of({})
      );
      spyOn(console, 'warn');
      mockCheckoutConfig.checkout.steps = [];

      guard.canActivate().subscribe(result => {
        expect(console.warn).toHaveBeenCalledWith(
          'Missing step with type shippingAddress in checkout configuration.'
        );
        expect(result.toString()).toEqual('/');
        done();
      });
    });
  });

  describe(`when there is shipping address present`, () => {
    it(`should return true`, done => {
      spyOn(mockCheckoutDetailsService, 'getDeliveryAddress').and.returnValue(
        of({ id: 'testAddress' })
      );

      guard.canActivate().subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });
  });
});
