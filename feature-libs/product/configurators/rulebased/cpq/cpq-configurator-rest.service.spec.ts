import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConverterService, OccEndpointsService } from '@spartacus/core';
import { MockOccEndpointsService } from 'projects/core/src/occ/adapters/user/unit-test.helper';
import { CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT } from '../root/interceptor/cpq-configurator-rest.interceptor';
import { CpqConfiguratorRestAdapter } from './cpq-configurator-rest.adapter';
import { CpqConfiguratorRestService } from './cpq-configurator-rest.service';
import {
  CPQ_CONFIGURATOR_NORMALIZER,
  CPQ_CONFIGURATOR_SERIALIZER,
} from './cpq-configurator.converters';
import { Cpq } from './cpq.models';
import { Configurator } from '../core/model/configurator.model';

const productCode = 'CONF_LAPTOP';
const groupId = '123';
const configId = '1234-56-7890';

const configCreatedResponse: Cpq.ConfigurationCreatedResponseData = {
  configurationId: configId,
};

const configResponse: Cpq.Configuration = {
  productSystemId: productCode,
  completed: false,
};

const configUpdateResponse = {};
const attrCode = '111';
const configuration: Configurator.Configuration = {
  configId: configId,
  productCode: productCode,
};
const updateAttribute: Cpq.UpdateAttribute = {
  configurationId: configId,
  standardAttributeCode: attrCode,
  changeAttributeValue: {},
};

describe('CpqConfiguratorRestService', () => {
  let serviceUnderTest: CpqConfiguratorRestService;
  let httpMock: HttpTestingController;
  let converterService: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CpqConfiguratorRestAdapter,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
      ],
    });

    httpMock = TestBed.inject(
      HttpTestingController as Type<HttpTestingController>
    );

    converterService = TestBed.inject(
      ConverterService as Type<ConverterService>
    );

    serviceUnderTest = TestBed.inject(
      CpqConfiguratorRestService as Type<CpqConfiguratorRestService>
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a configuration and call normalizer', () => {
    spyOn(converterService, 'pipeable').and.callThrough();
    serviceUnderTest.createConfiguration(productCode).subscribe((config) => {
      expect(config.configId).toEqual(configId);
      expect(converterService.pipeable).toHaveBeenCalledWith(
        CPQ_CONFIGURATOR_NORMALIZER
      );
    });

    let mockReq = httpMock.expectOne((req) => {
      return (
        req.method === 'POST' &&
        req.url ===
          `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations`
      );
    });
    mockReq.flush(configCreatedResponse);

    mockReq = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url ===
          `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${configId}/display`
      );
    });
    mockReq.flush(configResponse);
  });

  it('should read a configuration and call normalizer', () => {
    spyOn(converterService, 'pipeable').and.callThrough();
    serviceUnderTest
      .readConfiguration(configId, groupId)
      .subscribe((config) => {
        expect(config.configId).toEqual(configId);
        expect(converterService.pipeable).toHaveBeenCalledWith(
          CPQ_CONFIGURATOR_NORMALIZER
        );
      });

    const mockReq = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url ===
          `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${configId}/display`
      );
    });
    mockReq.flush(configResponse);
  });

  it('should call serializer, update configuration and call normalizer', () => {
    spyOn(converterService, 'convert').and.returnValue(updateAttribute);
    spyOn(converterService, 'pipeable').and.callThrough();
    serviceUnderTest.updateConfiguration(configuration).subscribe((config) => {
      expect(config.configId).toEqual(configId);
      expect(converterService.convert).toHaveBeenCalledWith(
        configuration,
        CPQ_CONFIGURATOR_SERIALIZER
      );
      expect(converterService.pipeable).toHaveBeenCalledWith(
        CPQ_CONFIGURATOR_NORMALIZER
      );
    });

    let mockReq = httpMock.expectOne((req) => {
      return (
        req.method === 'PATCH' &&
        req.url ===
          `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${configId}/attributes/${attrCode}`
      );
    });
    mockReq.flush(configUpdateResponse);

    mockReq = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url ===
          `${CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT}/api/configuration/v1/configurations/${configId}/display`
      );
    });
    mockReq.flush(configResponse);
  });
});
