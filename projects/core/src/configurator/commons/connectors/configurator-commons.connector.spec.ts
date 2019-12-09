import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Configurator } from '../../../model/configurator.model';
import { ConfigUtilsService } from '../utils/config-utils.service';
import { ConfiguratorCommonsAdapter } from './configurator-commons.adapter';
import { ConfiguratorCommonsConnector } from './configurator-commons.connector';
import createSpy = jasmine.createSpy;
const PRODUCT_CODE = 'CONF_LAPTOP';
const CONFIG_ID = '1234-56-7890';
const productConfiguration: Configurator.Configuration = {
  configId: CONFIG_ID,
  productCode: PRODUCT_CODE,
  owner: {
    id: PRODUCT_CODE,
    type: Configurator.OwnerType.PRODUCT,
  },
};

class MockConfiguratorCommonsAdapter implements ConfiguratorCommonsAdapter {
  getConfigurationOverview = createSpy().and.callFake((configId: string) =>
    of('getConfigurationOverview' + configId)
  );

  readPriceSummary = createSpy().and.callFake(configId =>
    of('readPriceSummary' + configId)
  );

  readConfiguration = createSpy().and.callFake(configId =>
    of('readConfiguration' + configId)
  );

  updateConfiguration = createSpy().and.callFake(configuration =>
    of('updateConfiguration' + configuration.configId)
  );

  createConfiguration = createSpy().and.callFake(owner =>
    of('createConfiguration' + owner)
  );

  addToCart = createSpy().and.callFake(configId => of('addToCart' + configId));
}

describe('ConfiguratorCommonsConnector', () => {
  let service: ConfiguratorCommonsConnector;
  let configuratorUtils: ConfigUtilsService;

  const GROUP_ID = 'GROUP1';
  const USER_ID = 'theUser';
  const CART_ID = '98876';
  const QUANTITY = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfiguratorCommonsAdapter,
          useClass: MockConfiguratorCommonsAdapter,
        },
      ],
    });

    service = TestBed.get(ConfiguratorCommonsConnector as Type<
      ConfiguratorCommonsConnector
    >);
    configuratorUtils = TestBed.get(ConfigUtilsService as Type<
      ConfigUtilsService
    >);
    configuratorUtils.setOwnerKey(productConfiguration.owner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call adapter on createConfiguration', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    let result;
    service.createConfiguration(PRODUCT_CODE).subscribe(res => (result = res));
    expect(result).toBe('createConfiguration' + productConfiguration.owner);
    expect(adapter.createConfiguration).toHaveBeenCalledWith(
      productConfiguration.owner
    );
  });

  it('should call adapter on readConfiguration', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    let result;
    service
      .readConfiguration(CONFIG_ID, GROUP_ID, productConfiguration.owner)
      .subscribe(res => (result = res));
    expect(result).toBe('readConfiguration' + CONFIG_ID);
    expect(adapter.readConfiguration).toHaveBeenCalledWith(
      CONFIG_ID,
      GROUP_ID,
      productConfiguration.owner
    );
  });

  it('should call adapter on updateConfiguration', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    let result;
    service
      .updateConfiguration(productConfiguration)
      .subscribe(res => (result = res));
    expect(result).toBe('updateConfiguration' + CONFIG_ID);
    expect(adapter.updateConfiguration).toHaveBeenCalledWith(
      productConfiguration
    );
  });

  it('should call adapter on readConfigurationPrice', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    let result;
    service
      .readPriceSummary(productConfiguration)
      .subscribe(res => (result = res));
    expect(result).toBe('readPriceSummary' + productConfiguration);
    expect(adapter.readPriceSummary).toHaveBeenCalledWith(productConfiguration);
  });

  it('should call adapter on getConfigurationOverview', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    let result;
    service
      .getConfigurationOverview(productConfiguration.configId)
      .subscribe(res => (result = res));
    expect(result).toBe(
      'getConfigurationOverview' + productConfiguration.configId
    );
    expect(adapter.getConfigurationOverview).toHaveBeenCalledWith(
      productConfiguration.configId
    );
  });

  it('should call adapter on addToCart', () => {
    const adapter = TestBed.get(ConfiguratorCommonsAdapter as Type<
      ConfiguratorCommonsAdapter
    >);

    const parameters: Configurator.AddToCartParameters = {
      userId: USER_ID,
      cartId: CART_ID,
      productCode: PRODUCT_CODE,
      quantity: QUANTITY,
      configId: CONFIG_ID,
      ownerKey: 'theKey',
    };
    let result;
    service.addToCart(parameters).subscribe(res => (result = res));
    expect(adapter.addToCart).toHaveBeenCalledWith(parameters);
    expect(result).toBe('addToCart' + parameters);
  });
});
