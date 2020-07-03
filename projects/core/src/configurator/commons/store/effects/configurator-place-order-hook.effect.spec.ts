import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { ActiveCartService } from '../../../../cart/facade/active-cart.service';
import { PlaceOrder } from '../../../../checkout/store/actions/checkout.action';
import { OrderEntry } from '../../../../model/order.model';
import { GenericConfigUtilsService } from '../../../generic/utils/config-utils.service';
import * as ConfiguratorActions from '../actions/configurator.action';
import { CONFIGURATION_FEATURE } from '../configuration-state';
import * as fromConfigurationReducers from '../reducers/index';
import * as fromEffects from './configurator-place-order-hook.effect';

const cartEntryWOconfiguration: OrderEntry[] = [
  {
    entryNumber: 1,
    product: {
      configurable: false,
    },
  },
  {
    entryNumber: 2,
    product: {
      configurable: false,
    },
  },
];

const cartEntryWithconfiguration: OrderEntry[] = [
  {
    entryNumber: 1,
    product: {
      configurable: true,
      configuratorType: 'CPQCONFIGURATOR',
    },
  },
  {
    entryNumber: 2,
    product: {
      configurable: false,
    },
  },
  {
    entryNumber: 3,
    product: {
      configurable: true,
      configuratorType: 'CPQCONFIGURATOR',
    },
  },
  {
    entryNumber: 4,
    product: {
      configurable: true,
      configuratorType: 'some other configurator',
    },
  },
];
class MockActiveCartService {
  getEntries(): void {}
}

describe('ConfiguratorPlaceOrderHookEffects', () => {
  let actions$: Observable<any>;
  let configPlaceOrderHookEffects: fromEffects.ConfiguratorPlaceOrderHookEffects;
  let configuratorUtils: GenericConfigUtilsService;
  let activeCartService: ActiveCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          CONFIGURATION_FEATURE,
          fromConfigurationReducers.getConfiguratorReducers()
        ),
      ],

      providers: [
        fromEffects.ConfiguratorPlaceOrderHookEffects,
        provideMockActions(() => actions$),
        {
          provide: ActiveCartService,
          useClass: MockActiveCartService,
        },
      ],
    });

    configPlaceOrderHookEffects = TestBed.inject(
      fromEffects.ConfiguratorPlaceOrderHookEffects as Type<
        fromEffects.ConfiguratorPlaceOrderHookEffects
      >
    );
    configuratorUtils = TestBed.inject(
      GenericConfigUtilsService as Type<GenericConfigUtilsService>
    );
    activeCartService = TestBed.inject(
      ActiveCartService as Type<ActiveCartService>
    );
    spyOn(configuratorUtils, 'setOwnerKey').and.callThrough();
  });

  it('should provide configuration place order hook effects', () => {
    expect(configPlaceOrderHookEffects).toBeTruthy();
  });

  it('should emit remove configuration when order is placed - cart contains configured products', () => {
    spyOn(activeCartService, 'getEntries').and.returnValue(
      of(cartEntryWithconfiguration)
    );

    const action = new PlaceOrder({
      cartId: '',
      userId: '',
    });
    const completion = new ConfiguratorActions.RemoveConfiguration({
      ownerKey: ['cartEntry/1', 'cartEntry/3'],
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(configPlaceOrderHookEffects.placeOrder$).toBeObservable(expected);
  });

  it('should emit remove configuration when order is placed - cart contains no configured products', () => {
    spyOn(activeCartService, 'getEntries').and.returnValue(
      of(cartEntryWOconfiguration)
    );

    const action = new PlaceOrder({
      cartId: '',
      userId: '',
    });
    const completion = new ConfiguratorActions.RemoveConfiguration({
      ownerKey: [],
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(configPlaceOrderHookEffects.placeOrder$).toBeObservable(expected);
  });
});
