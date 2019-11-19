import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OccConfiguratorVariantAdapter } from '.';
import {
  CONFIGURATION_NORMALIZER,
  CONFIGURATION_PRICE_SUMMARY_NORMALIZER,
  CONFIGURATION_SERIALIZER,
} from '../../../../configurator/commons/connectors/converters';
import { Configurator } from '../../../../model/configurator.model';
import { ConverterService } from '../../../../util/converter.service';
import { OccEndpointsService } from '../../../services/occ-endpoints.service';

class MockOccEndpointsService {
  getUrl(endpoint: string, _urlParams?: object, _queryParams?: object) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(url: string) {
    return url;
  }
}
const productCode = 'CONF_LAPTOP';
const configId = '1234-56-7890';
const groupId = 'GROUP1';

const productConfiguration: Configurator.Configuration = {
  configId: configId,
  productCode: productCode,
};

describe('OccConfigurationVariantAdapter', () => {
  let occConfiguratorVariantAdapter: OccConfiguratorVariantAdapter;
  let httpMock: HttpTestingController;
  let converterService: ConverterService;
  let occEnpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccConfiguratorVariantAdapter,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
      ],
    });

    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    converterService = TestBed.get(ConverterService as Type<ConverterService>);
    occEnpointsService = TestBed.get(OccEndpointsService as Type<
      OccEndpointsService
    >);

    occConfiguratorVariantAdapter = TestBed.get(
      OccConfiguratorVariantAdapter as Type<OccConfiguratorVariantAdapter>
    );

    spyOn(converterService, 'pipeable').and.callThrough();
    spyOn(converterService, 'convert').and.callThrough();
    spyOn(occEnpointsService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call createConfiguration endpoint', () => {
    occConfiguratorVariantAdapter.createConfiguration(productCode).subscribe();

    const mockReq = httpMock.expectOne(req => {
      return req.method === 'GET' && req.url === 'createConfiguration';
    });

    expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
      'createConfiguration',
      {
        productCode,
      }
    );

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    expect(converterService.pipeable).toHaveBeenCalledWith(
      CONFIGURATION_NORMALIZER
    );
  });

  it('should call readConfiguration endpoint', () => {
    occConfiguratorVariantAdapter
      .readConfiguration(configId, groupId)
      .subscribe();

    const mockReq = httpMock.expectOne(req => {
      return req.method === 'GET' && req.url === 'readConfiguration';
    });

    expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
      'readConfiguration',
      { configId },
      { groupId }
    );

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    expect(converterService.pipeable).toHaveBeenCalledWith(
      CONFIGURATION_NORMALIZER
    );
  });

  it('should call updateConfiguration endpoint', () => {
    occConfiguratorVariantAdapter
      .updateConfiguration(productConfiguration)
      .subscribe();

    const mockReq = httpMock.expectOne(req => {
      return req.method === 'PUT' && req.url === 'updateConfiguration';
    });

    expect(occEnpointsService.getUrl).toHaveBeenCalledWith(
      'updateConfiguration',
      {
        productCode,
      }
    );

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    expect(converterService.pipeable).toHaveBeenCalledWith(
      CONFIGURATION_NORMALIZER
    );
    expect(converterService.convert).toHaveBeenCalledWith(
      productConfiguration,
      CONFIGURATION_SERIALIZER
    );
  });

  it('should call readConfigurationPrice endpoint', () => {
    occConfiguratorVariantAdapter.readPriceSummary(configId).subscribe();

    const mockReq = httpMock.expectOne(req => {
      return req.method === 'PATCH' && req.url === 'readPriceSummary';
    });

    expect(occEnpointsService.getUrl).toHaveBeenCalledWith('readPriceSummary', {
      configId,
    });

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    expect(converterService.pipeable).toHaveBeenCalledWith(
      CONFIGURATION_PRICE_SUMMARY_NORMALIZER
    );
  });
});
