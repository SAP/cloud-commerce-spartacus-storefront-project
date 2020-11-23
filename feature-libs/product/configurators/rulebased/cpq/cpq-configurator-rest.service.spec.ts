import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OccEndpointsService } from '@spartacus/core';
import { MockOccEndpointsService } from 'projects/core/src/occ/adapters/user/unit-test.helper';
import { CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT } from '../root/interceptor/cpq-configurator-rest.interceptor';
import { CpqConfiguratorRestAdapter } from './cpq-configurator-rest.adapter';
import { CpqConfiguratorRestService } from './cpq-configurator-rest.service';
import { Cpq } from './cpq.models';

const productCode = 'CONF_LAPTOP';
const configId = '1234-56-7890';

const configCreatedResponse: Cpq.ConfigurationCreatedResponseData = {
  configurationId: configId,
  sessionId: '123',
};

const configResponse: Cpq.Configuration = {
  productSystemId: productCode,
  completed: false,
};

describe('CpqConfiguratorRestService', () => {
  let serviceUnderTest: CpqConfiguratorRestService;
  let httpMock: HttpTestingController;

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

    serviceUnderTest = TestBed.inject(
      CpqConfiguratorRestService as Type<CpqConfiguratorRestService>
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a token and use it to init a configuration', () => {
    serviceUnderTest.createConfiguration(productCode).subscribe((config) => {
      expect(config.configId).toEqual(configId);
      expect(config.productCode).toEqual(productCode);
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
});
