import { TestBed } from '@angular/core/testing';

import { SiteContextRoutesHandler } from './site-context-routes-handler';
import { SiteContextParamsService } from '../facade/site-context-params.service';

describe('SiteContextRoutesHandlerService', () => {
  const mockSiteContextParamsService = {
    getContextParameters: () => {}
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        SiteContextRoutesHandler,
        {
          provide: SiteContextParamsService,
          useValue: mockSiteContextParamsService
        }
      ]
    })
  );

  it('should be created', () => {
    const service: SiteContextRoutesHandler = TestBed.get(
      SiteContextRoutesHandler
    );
    expect(service).toBeTruthy();
  });
});
