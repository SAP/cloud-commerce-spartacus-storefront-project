import { TestBed } from '@angular/core/testing';

import { CmsPageConnector } from './cms-page.connector';
import { CmsPageAdapter } from './cms-page.adapter';
import {
  CmsStructureConfigService,
  PageContext,
  PageType,
} from '@spartacus/core';
import { of } from 'rxjs/internal/observable/of';
import createSpy = jasmine.createSpy;

class MockCmsPageAdapter implements CmsPageAdapter {
  load = createSpy('CmsComponentAdapter.load').and.callFake(({ id }) =>
    of('page' + id)
  );
}

class MockCmsStructureConfigService {
  mergePageStructure = createSpy().and.callFake(id => of(id));
  shouldIgnoreBackend = createSpy().and.returnValue(of(false));
}

const context: PageContext = {
  id: '123',
  type: PageType.PRODUCT_PAGE,
};

describe('CmsPageConnector', () => {
  let service: CmsPageConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CmsPageAdapter, useClass: MockCmsPageAdapter },
        {
          provide: CmsStructureConfigService,
          useClass: MockCmsStructureConfigService,
        },
      ],
    });

    service = TestBed.get(CmsPageConnector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should call adapter', () => {
      const adapter = TestBed.get(CmsPageAdapter);

      let result;
      service.get(context).subscribe(res => (result = res));
      expect(result).toBe('123');
      expect(adapter.load).toHaveBeenCalledWith(context);
    });

    it('should use CmsStructureConfigService', () => {
      const structureConfigService = TestBed.get(CmsStructureConfigService);
      service.get(context).subscribe();
      expect(structureConfigService.shouldIgnoreBackend).toHaveBeenCalledWith(
        context.id
      );
      expect(structureConfigService.mergePageStructure).toHaveBeenCalledWith(
        context.id,
        'page123'
      );
    });
  });
});
