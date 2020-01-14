import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { CartActions } from '../../../../cart/store/actions/';
import { CartModification } from '../../../../model/cart.model';
import { GenericConfigurator } from '../../../../model/generic-configurator.model';
import { makeErrorSerializable } from '../../../../util/serialization-utils';
import { GenericConfigUtilsService } from '../../../generic/utils/config-utils.service';
import * as fromConfigurationReducers from '../../store/reducers/index';
import { ConfiguratorUiActions } from '../actions';
import * as ConfiguratorActions from '../actions/configurator.action';
import { CONFIGURATION_FEATURE } from '../configuration-state';
import { Configurator } from './../../../../model/configurator.model';
import { ConfiguratorCommonsConnector } from './../../connectors/configurator-commons.connector';
import * as fromEffects from './configurator.effect';

const productCode = 'CONF_LAPTOP';
const configId = '1234-56-7890';
const groupId = 'GROUP-1';
const cartId = 'CART-1234';
const userId = 'theUser';
const quantity = 1;
const entryNumber = 47;
const errorResponse: HttpErrorResponse = new HttpErrorResponse({
  error: 'notFound',
  status: 404,
});
const owner: GenericConfigurator.Owner = {
  type: GenericConfigurator.OwnerType.PRODUCT,
  id: productCode,
};
const productConfiguration: Configurator.Configuration = {
  configId: 'a',
  productCode: productCode,
  owner: owner,
  complete: true,
  consistent: true,
  overview: {
    groups: [
      {
        id: 'a',
        groupDescription: 'a',
        attributes: [
          {
            attribute: 'a',
            value: 'A',
          },
        ],
      },
    ],
  },
  groups: [{ id: groupId, attributes: [{ name: 'attrName' }], subGroups: [] }],
};
const cartModification: CartModification = {
  quantity: 1,
  quantityAdded: 1,
  entry: {
    product: { code: productCode },
    quantity: 1,
    entryNumber: entryNumber,
  },
};

describe('ConfiguratorEffect', () => {
  let createMock: jasmine.Spy;
  let readMock: jasmine.Spy;
  let addToCartMock: jasmine.Spy;
  let configEffects: fromEffects.ConfiguratorEffects;
  let configuratorUtils: GenericConfigUtilsService;

  let actions$: Observable<any>;

  beforeEach(() => {
    createMock = jasmine.createSpy().and.returnValue(of(productConfiguration));
    readMock = jasmine.createSpy().and.returnValue(of(productConfiguration));
    addToCartMock = jasmine.createSpy().and.returnValue(of(cartModification));
    class MockConnector {
      createConfiguration = createMock;

      readConfiguration = readMock;

      addToCart = addToCartMock;

      updateConfiguration(): Observable<Configurator.Configuration> {
        return of(productConfiguration);
      }

      readPriceSummary(): Observable<Configurator.Configuration> {
        return of(productConfiguration);
      }

      getConfigurationOverview(): Observable<Configurator.Overview> {
        return of(productConfiguration.overview);
      }
    }
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          CONFIGURATION_FEATURE,
          fromConfigurationReducers.getConfiguratorReducers()
        ),
      ],

      providers: [
        fromEffects.ConfiguratorEffects,
        provideMockActions(() => actions$),
        {
          provide: ConfiguratorCommonsConnector,
          useClass: MockConnector,
        },
      ],
    });

    configEffects = TestBed.get(fromEffects.ConfiguratorEffects as Type<
      fromEffects.ConfiguratorEffects
    >);
    configuratorUtils = TestBed.get(GenericConfigUtilsService as Type<
      GenericConfigUtilsService
    >);
    configuratorUtils.setOwnerKey(owner);
  });

  it('should provide configuration effects', () => {
    expect(configEffects).toBeTruthy();
  });

  it('should emit a success action with content for an action of type createConfiguration', () => {
    const action = new ConfiguratorActions.CreateConfiguration(
      productCode,
      productCode
    );

    const completion = new ConfiguratorActions.CreateConfigurationSuccess(
      productConfiguration
    );
    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(configEffects.createConfiguration$).toBeObservable(expected);
  });

  it('must not emit anything in case source action is not covered, createConfiguration', () => {
    const action = new ConfiguratorActions.CreateConfigurationSuccess(
      productConfiguration
    );
    actions$ = hot('-a', { a: action });

    configEffects.createConfiguration$.subscribe(emitted => fail(emitted));
  });

  it('should emit a fail action in case something goes wrong', () => {
    createMock.and.returnValue(throwError(errorResponse));

    const action = new ConfiguratorActions.CreateConfiguration(
      productCode,
      productCode
    );

    const completionFailure = new ConfiguratorActions.CreateConfigurationFail(
      productCode,
      makeErrorSerializable(errorResponse)
    );
    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completionFailure });

    expect(configEffects.createConfiguration$).toBeObservable(expected);
  });

  it('should emit a success action with content for an action of type readConfiguration', () => {
    const payloadInput: Configurator.Configuration = {
      configId: configId,
      owner: owner,
    };
    const action = new ConfiguratorActions.ReadConfiguration(payloadInput, '');

    const completion = new ConfiguratorActions.ReadConfigurationSuccess(
      productConfiguration
    );
    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(configEffects.readConfiguration$).toBeObservable(expected);
  });

  it('must not emit anything in case source action is not covered, readConfiguration', () => {
    const payloadInput = { configId: configId, owner: owner };
    const action = new ConfiguratorActions.ReadConfigurationSuccess(
      payloadInput
    );
    actions$ = hot('-a', { a: action });

    configEffects.readConfiguration$.subscribe(emitted => fail(emitted));
    // just to get rid of the SPEC_HAS_NO_EXPECTATIONS message.
    // The actual test is done in the subscribe part
    expect(true).toBeTruthy();
  });

  it('should emit a success action with content for an action of type getConfigurationOverview', () => {
    const payloadInput: Configurator.Configuration = {
      configId: configId,
      owner: owner,
    };
    const action = new ConfiguratorActions.GetConfigurationOverview(
      payloadInput
    );

    const completion = new ConfiguratorActions.GetConfigurationOverviewSuccess(
      owner.key,
      productConfiguration.overview
    );
    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(configEffects.getOverview$).toBeObservable(expected);
  });

  it('must not emit anything in case source action is not covered, getConfigurationOverview', () => {
    const action = new ConfiguratorActions.GetConfigurationOverviewSuccess(
      owner.key,
      {}
    );
    actions$ = hot('-a', { a: action });

    configEffects.getOverview$.subscribe(emitted => fail(emitted));
    // just to get rid of the SPEC_HAS_NO_EXPECTATIONS message.
    // The actual test is done in the subscribe part
    expect(true).toBeTruthy();
  });

  describe('Effect updateConfiguration', () => {
    it('should emit a success action with content for an action of type updateConfiguration', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfiguration(payloadInput);

      const completion = new ConfiguratorActions.UpdateConfigurationSuccess(
        productConfiguration
      );
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(configEffects.updateConfiguration$).toBeObservable(expected);
    });

    it('must not emit anything in case source action is not covered, updateConfiguration', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfigurationSuccess(
        payloadInput
      );
      actions$ = hot('-a', { a: action });

      configEffects.updateConfiguration$.subscribe(emitted => fail(emitted));
      // just to get rid of the SPEC_HAS_NO_EXPECTATIONS message.
      // The actual test is done in the subscribe part
      expect(true).toBeTruthy();
    });
  });

  describe('Effect updateConfigurationSuccess', () => {
    it('should raise UpdateConfigurationFinalize on UpdateConfigurationSuccess in case no changes are pending', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfigurationSuccess(
        payloadInput
      );
      const finalizeSuccess = new ConfiguratorActions.UpdateConfigurationFinalizeSuccess(
        productConfiguration
      );
      const updatePrices = new ConfiguratorActions.UpdatePriceSummary(
        productConfiguration
      );
      const setCurrentGroup = new ConfiguratorUiActions.SetCurrentGroup(
        productConfiguration.owner.key,
        groupId
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bcd)', {
        b: finalizeSuccess,
        c: updatePrices,
        d: setCurrentGroup,
      });
      expect(configEffects.updateConfigurationSuccess$).toBeObservable(
        expected
      );
    });
  });
  describe('Effect updateConfigurationFail', () => {
    it('should raise UpdateConfigurationFinalizeFail on UpdateConfigurationFail in case no changes are pending', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfigurationFail(
        productConfiguration.productCode,
        payloadInput
      );
      const completion = new ConfiguratorActions.UpdateConfigurationFinalizeFail(
        productConfiguration
      );
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(configEffects.updateConfigurationFail$).toBeObservable(expected);
    });
    it('must not emit anything in case of UpdateConfigurationSuccess', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfigurationSuccess(
        payloadInput
      );
      actions$ = hot('-a', { a: action });

      configEffects.updateConfigurationFail$.subscribe(emitted =>
        fail(emitted)
      );
      // just to get rid of the SPEC_HAS_NO_EXPECTATIONS message.
      // The actual test is done in the subscribe part
      expect(true).toBeTruthy();
    });
  });
  describe('Effect handleErrorOnUpdate', () => {
    it('should emit ReadConfiguration on UpdateConfigurationFinalizeFail', () => {
      const payloadInput = productConfiguration;
      const action = new ConfiguratorActions.UpdateConfigurationFinalizeFail(
        payloadInput
      );
      const completion = new ConfiguratorActions.ReadConfiguration(
        productConfiguration,
        ''
      );
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(configEffects.handleErrorOnUpdate$).toBeObservable(expected);
    });
  });
  describe('Effect groupChange', () => {
    it('should emit ReadConfigurationSuccess and SetCurrentGroup/SetParentGroup on ChangeGroup in case no changes are pending', () => {
      const payloadInput: Configurator.Configuration = {
        configId: configId,
        productCode: productCode,
        owner: owner,
      };
      const action = new ConfiguratorActions.ChangeGroup(
        payloadInput,
        groupId,
        null
      );
      const readConfigurationSuccess = new ConfiguratorActions.ReadConfigurationSuccess(
        productConfiguration
      );
      const setCurrentGroup = new ConfiguratorUiActions.SetCurrentGroup(
        productConfiguration.owner.key,
        groupId
      );
      const setMenuParentGroup = new ConfiguratorUiActions.SetMenuParentGroup(
        productConfiguration.owner.key,
        null
      );

      actions$ = hot('-a', { a: action });

      const expected = cold('-(bcd)', {
        b: setCurrentGroup,
        c: setMenuParentGroup,
        d: readConfigurationSuccess,
      });
      expect(configEffects.groupChange$).toBeObservable(expected);
    });

    it('should emit ReadConfigurationFail in case read call is not successful', () => {
      readMock.and.returnValue(throwError(errorResponse));
      const payloadInput: Configurator.Configuration = {
        configId: configId,
        productCode: productCode,
        owner: owner,
      };
      const action = new ConfiguratorActions.ChangeGroup(
        payloadInput,
        groupId,
        null
      );
      const readConfigurationFail = new ConfiguratorActions.ReadConfigurationFail(
        productConfiguration.owner.key,
        makeErrorSerializable(errorResponse)
      );

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', {
        b: readConfigurationFail,
      });
      expect(configEffects.groupChange$).toBeObservable(expected);
    });
  });

  describe('Effect addToCart', () => {
    it('should emit AddToCartSuccess, AddOwner on addToCart in case no changes are pending', () => {
      const payloadInput: Configurator.AddToCartParameters = {
        userId: userId,
        cartId: cartId,
        productCode: productCode,
        quantity: quantity,
        configId: configId,
        ownerKey: owner.key,
      };
      const action = new ConfiguratorActions.AddToCart(payloadInput);
      const cartAddEntrySuccess = new CartActions.CartAddEntrySuccess({
        ...cartModification,
        userId: userId,
        cartId: cartId,
      });

      const removeConfiguration = new ConfiguratorActions.AddNextOwner(
        owner.key,
        '' + entryNumber
      );
      actions$ = hot('-a', { a: action });
      const expected = cold('-(cd)', {
        c: removeConfiguration,
        d: cartAddEntrySuccess,
      });
      expect(configEffects.addToCart$).toBeObservable(expected);
    });

    it('should emit AddToCartFail in case add to cart call is not successful', () => {
      addToCartMock.and.returnValue(throwError(errorResponse));
      const payloadInput: Configurator.AddToCartParameters = {
        userId: userId,
        cartId: cartId,
        productCode: productCode,
        quantity: quantity,
        configId: configId,
        ownerKey: owner.key,
      };
      const action = new ConfiguratorActions.AddToCart(payloadInput);
      const cartAddEntryFail = new CartActions.CartAddEntryFail(
        makeErrorSerializable(errorResponse)
      );

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', {
        b: cartAddEntryFail,
      });
      expect(configEffects.addToCart$).toBeObservable(expected);
    });
  });

  describe('Effect addToCartCartProcessIncrement', () => {
    it('should emit CartProcessesIncrement on addToCart in case no changes are pending', () => {
      const payloadInput: Configurator.AddToCartParameters = {
        userId: userId,
        cartId: cartId,
        productCode: productCode,
        quantity: quantity,
        configId: configId,
        ownerKey: owner.key,
      };
      const action = new ConfiguratorActions.AddToCart(payloadInput);
      const cartProcessIncrement = new CartActions.CartProcessesIncrement(
        cartId
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-d', {
        d: cartProcessIncrement,
      });
      expect(configEffects.addToCartCartProcessIncrement$).toBeObservable(
        expected
      );
    });
  });

  describe('getGroupWithAttributes', () => {
    it('should find group in single level config', () => {
      expect(
        configEffects.getGroupWithAttributes(productConfiguration.groups)
      ).toBe(groupId);
    });

    it('should find group in multi level config', () => {
      const groups: Configurator.Group[] = [
        {
          attributes: [],
          subGroups: [
            {
              attributes: [],
              subGroups: [],
            },
            {
              attributes: [],
              subGroups: [],
            },
          ],
        },
        {
          attributes: [],
          subGroups: productConfiguration.groups,
        },
        {
          attributes: [],
          subGroups: [
            {
              attributes: [],
              subGroups: [],
            },
          ],
        },
      ];
      expect(configEffects.getGroupWithAttributes(groups)).toBe(groupId);
    });

    it('should find no group in multi level config in case no attributes exist at all', () => {
      const groups: Configurator.Group[] = [
        {
          attributes: [],
          subGroups: [
            {
              attributes: [],
              subGroups: [],
            },
            {
              attributes: [],
              subGroups: [],
            },
          ],
        },
        {
          attributes: [],
          subGroups: productConfiguration.groups,
        },
        {
          attributes: [],
          subGroups: [
            {
              attributes: [],
              subGroups: [],
            },
          ],
        },
      ];
      productConfiguration.groups[0].attributes = [];
      expect(configEffects.getGroupWithAttributes(groups)).toBeUndefined();
    });
  });
});
