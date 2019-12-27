import { TestBed } from '@angular/core/testing';

import { LoadingScopesService } from './loading-scopes.service';
import { OccConfig } from '@spartacus/core';

describe('LoadingScopesService', () => {
  let service: LoadingScopesService;

  const mockConfig: OccConfig = {
    backend: {
      loadingScopes: {
        product: {
          list: {
            include: ['base'],
          },
          detail: {
            include: ['list'],
          },
          order: {
            include: ['base'],
            maxAge: 60,
          },
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: OccConfig, useValue: mockConfig }],
    });
    service = TestBed.get(LoadingScopesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('expand', () => {
    it('should return scopes if there is no config', () => {
      const result = service.expand('test', ['test']);
      expect(result).toEqual(['test']);
    });

    it('should extend scopes', () => {
      const result = service.expand('product', ['list']);
      expect(result).toEqual(['base', 'list']);
    });

    it('should extend scopes multiple level deep', () => {
      const result = service.expand('product', ['detail']);
      expect(result).toEqual(['base', 'list', 'detail']);
    });

    it('should not duplicate scopes', () => {
      const result = service.expand('product', ['detail', 'order', 'base']);
      expect(result).toEqual(['list', 'detail', 'order', 'base']);
    });
  });

  describe('getMaxAge', () => {
    it('should return maxAge in milliseconds', () => {
      const result = service.getMaxAge('product', 'order');
      expect(result).toEqual(60000);
    });
    it('should return 0 for not configured maxAge', () => {
      const result = service.getMaxAge('product', 'detail');
      expect(result).toEqual(0);
    });
  });
});
