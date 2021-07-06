import { TestBed } from '@angular/core/testing';
import { OccConfig } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CxEvent } from '../../event/cx-event';
import { EventService } from '../../event/event.service';
import { LoadingScopesService } from './loading-scopes.service';

class MockEvent1 extends CxEvent {}
class MockEvent2 extends CxEvent {}
const expectedEventPayload = of(1);
class MockEventService implements Partial<EventService> {
  get(): Observable<any> {
    return expectedEventPayload;
  }
}

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
            reloadOn: [MockEvent1, MockEvent2],
          },
          order: {
            include: ['base', 'list'],
            maxAge: 60,
          },
          zczapy: {
            include: ['order', 'detail', 'list'],
          },
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OccConfig, useValue: mockConfig },
        { provide: EventService, useClass: MockEventService },
      ],
    });
    service = TestBed.inject(LoadingScopesService);
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
      expect(result).toEqual(['detail', 'list', 'order', 'base']);
    });

    it('should keep proper order of included scopes', () => {
      const result = service.expand('product', ['order', 'list']);
      expect(result).toEqual(['order', 'base', 'list']);
    });

    it('should behave predictably for complex cases', () => {
      expect(service.expand('product', ['order', 'zczapy', 'detail'])).toEqual([
        'order',
        'zczapy',
        'base',
        'list',
        'detail',
      ]);

      expect(service.expand('product', ['order', 'zczapy'])).toEqual([
        'order',
        'detail',
        'base',
        'list',
        'zczapy',
      ]);

      expect(service.expand('product', ['zczapy'])).toEqual([
        'order',
        'detail',
        'base',
        'list',
        'zczapy',
      ]);

      expect(service.expand('product', ['zczapy', 'order'])).toEqual([
        'detail',
        'zczapy',
        'base',
        'list',
        'order',
      ]);
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

  describe('getReloadingTriggers', () => {
    it('should return an empty array when no triggers are configured', () => {
      const result = service.getReloadingTriggers('product', 'zczapy');
      expect(result.length).toEqual(0);
    });
    it('should return the configured triggers', () => {
      const result = service.getReloadingTriggers('product', 'detail');
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(expectedEventPayload);
      expect(result[1]).toEqual(expectedEventPayload);
    });
  });
});
