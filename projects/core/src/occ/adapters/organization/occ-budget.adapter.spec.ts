import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConverterService, BUDGET_NORMALIZER } from '@spartacus/core';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { OccBudgetAdapter } from './occ-budget.adapter';

import createSpy = jasmine.createSpy;

const budgetCode = 'testCode';
const userId = 'userId';
const budget = {
  code: budgetCode,
  name: 'testBudget',
};

class MockOccEndpointsService {
  getUrl = createSpy('MockOccEndpointsService.getEndpoint').and.callFake(
    // tslint:disable-next-line:no-shadowed-variable
    (url, { budgetCode }) => (url === 'budget' ? url + budgetCode : url)
  );
}

describe('OccBudgetAdapter', () => {
  let service: OccBudgetAdapter;
  let httpMock: HttpTestingController;

  let converterService: ConverterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccBudgetAdapter,
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
        // { provide: ConverterService, useClass: MockConvertService },
      ],
    });
    converterService = TestBed.get(ConverterService as Type<ConverterService>);
    service = TestBed.get(OccBudgetAdapter as Type<OccBudgetAdapter>);
    httpMock = TestBed.get(HttpTestingController as Type<
      HttpTestingController
    >);
    spyOn(converterService, 'pipeable').and.callThrough();
    spyOn(converterService, 'pipeableMany').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load budget details', () => {
    it('should load budget details for given budget code', () => {
      service.load(userId, budgetCode).subscribe();
      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === 'budget' + budgetCode;
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(budget);
      expect(converterService.pipeable).toHaveBeenCalledWith(BUDGET_NORMALIZER);
    });

    it('should load budget list', () => {
      service.loadList(userId).subscribe();
      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === 'budgets';
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush([budget]);
      expect(converterService.pipeableMany).toHaveBeenCalledWith(
        BUDGET_NORMALIZER
      );
    });
  });
});
