import { AbstractType, InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AuthService,
  FacadeFactoryService,
  SiteContextParamsService,
  StatePersistenceService,
  StorageSyncType,
} from '@spartacus/core';
import { cold } from 'jasmine-marbles';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ActiveCartFacade } from '../../facade/active-cart.facade';
import { Cart } from '../../models/cart.model';
import { MiniCartComponentService } from './mini-cart-component.service';

const activeCart = new ReplaySubject<Cart>();

class MockAuthService implements Partial<AuthService> {
  isUserLoggedIn(): Observable<boolean> {
    return of(false);
  }
}

class MockActiveCartFacade implements Partial<ActiveCartFacade> {
  getActive(): Observable<Cart> {
    return activeCart.asObservable();
  }
}

class MockFacadeFactoryService implements Partial<FacadeFactoryService> {
  isFacadeImplProvided<T>(
    _token: Type<T> | InjectionToken<T> | AbstractType<T>
  ): Observable<boolean> {
    return of(true);
  }
}

class MockStatePersistenceService implements Partial<StatePersistenceService> {
  readStateFromStorage<T>({}: {
    key: string;
    context?: string | Array<string>;
    storageType?: StorageSyncType;
  }): T | undefined {
    return {} as T | undefined;
  }
}
class MockSiteContextParamsService
  implements Partial<SiteContextParamsService>
{
  getValues(_params: string[]): Observable<Array<string>> {
    return of([]);
  }
}

const mockBrowserCartStateWithCart = {
  active: 'mockCartId',
};

const mockBrowserCartStateNoCart = {
  active: '',
};

const mockBaseSite = 'mockBaseSite';

describe('MiniCartComponentService', () => {
  let service: MiniCartComponentService;
  let activeCartFacade: ActiveCartFacade;
  let statePersistenceService: StatePersistenceService;
  let siteContextParamsService: SiteContextParamsService;
  let authService: AuthService;
  let facadeFactoryService: FacadeFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ActiveCartFacade, useClass: MockActiveCartFacade },
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: StatePersistenceService,
          useClass: MockStatePersistenceService,
        },
        {
          provide: SiteContextParamsService,
          useClass: MockSiteContextParamsService,
        },
        { provide: FacadeFactoryService, useClass: MockFacadeFactoryService },
      ],
    });
    service = TestBed.inject(MiniCartComponentService);
    activeCartFacade = TestBed.inject(ActiveCartFacade);
    statePersistenceService = TestBed.inject(StatePersistenceService);
    siteContextParamsService = TestBed.inject(SiteContextParamsService);
    authService = TestBed.inject(AuthService);
    facadeFactoryService = TestBed.inject(FacadeFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartStateFromBrowserStorage', () => {
    it('should return the state from the browser storage', () => {
      spyOn(siteContextParamsService, 'getValues').and.returnValue(
        cold('a', { a: [mockBaseSite] })
      );
      spyOn(statePersistenceService, 'readStateFromStorage').and.returnValue(
        mockBrowserCartStateWithCart
      );
      const result = (service as any)['getCartStateFromBrowserStorage']();
      expect(result).toBeObservable(
        cold('r', { r: mockBrowserCartStateWithCart })
      );
    });
  });

  describe('hasActiveCartInStorage', () => {
    it('should return true when the browser storage has an active cart.', () => {
      spyOn(service as any, 'getCartStateFromBrowserStorage').and.returnValue(
        cold('a', {
          a: mockBrowserCartStateWithCart,
        })
      );
      expect((service as any)['hasActiveCartInStorage']()).toBeObservable(
        cold('t', { t: true })
      );
    });

    it('should return false when the browser storage has no active cart.', () => {
      spyOn(service as any, 'getCartStateFromBrowserStorage').and.returnValue(
        cold('a', {
          a: mockBrowserCartStateNoCart,
        })
      );
      expect((service as any)['hasActiveCartInStorage']()).toBeObservable(
        cold('f', { f: false })
      );
    });

    it('should return false and then true if we swiitch to a site with a cart in storage.', () => {
      spyOn(service as any, 'getCartStateFromBrowserStorage').and.returnValue(
        cold('a---b', {
          a: mockBrowserCartStateNoCart,
          b: mockBrowserCartStateWithCart,
        })
      );
      expect((service as any)['hasActiveCartInStorage']()).toBeObservable(
        cold('f---t', { f: false, t: true })
      );
    });
  });

  describe('activeCartRequired', () => {
    it('should return false if no user is logged in and no cart in browser storage and cart facade chunk is not yet loaded', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f', { f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('f', { f: false })
      );
    });

    it('should return true if there is a cart in browser storage', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('t', { t: true })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f', { f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('(t|)', { t: true })
      );
    });

    it('should return true if a user is logged in.', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('t', { t: true })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f', { f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('(t|)', { t: true })
      );
    });

    it('should return true if the cart facade is already loaded', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('t', { t: true })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('t', { t: true })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('(t|)', { t: true })
      );
    });

    it('should eventually return true if ther is a cart in browser storage', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('f--t', { t: true, f: false })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f', { f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('f--(t|)', { t: true, f: false })
      );
    });

    it('should eventually return true if a user eventually logs in.', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f--f--t', { t: true, f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f', { f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('f-----(t|)', { t: true, f: false })
      );
    });

    it('should eventually return true if the cart facade chunk is loaded.', () => {
      spyOn(service as any, 'hasActiveCartInStorage').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(authService, 'isUserLoggedIn').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(facadeFactoryService, 'isFacadeImplProvided').and.returnValue(
        cold('f--t', { t: true, f: false })
      );
      expect((service as any)['activeCartRequired']()).toBeObservable(
        cold('f--(t|)', { t: true, f: false })
      );
    });
  });

  describe('getTotalPrice', () => {
    it('should return default value when user has no cart', () => {
      spyOn(service as any, 'activeCartRequired').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(activeCartFacade, 'getActive').and.stub();
      expect(service.getTotalPrice()).toBeObservable(cold('a', { a: '' }));
      expect(activeCartFacade.getActive).not.toHaveBeenCalled();
    });

    it('should return value from activeCartFacade when user has a cart', () => {
      spyOn(service as any, 'activeCartRequired').and.returnValue(
        cold('(t|)', { t: true })
      );
      const mockActiveCart = {
        totalPrice: {
          formattedValue: '122$',
        },
      } as Partial<Cart>;

      spyOn(activeCartFacade, 'getActive').and.returnValue(
        cold('c', { c: mockActiveCart })
      );
      expect(service.getTotalPrice()).toBeObservable(cold('a', { a: '122$' }));
    });
  });

  describe('getQuantity', () => {
    it('should return default value when user has no cart', () => {
      spyOn(service as any, 'activeCartRequired').and.returnValue(
        cold('f', { f: false })
      );
      spyOn(activeCartFacade, 'getActive').and.stub();
      expect(service.getQuantity()).toBeObservable(cold('a', { a: 0 }));
      expect(activeCartFacade.getActive).not.toHaveBeenCalled();
    });

    it('should return value from activeCartFacade when user has a cart', () => {
      spyOn(service as any, 'activeCartRequired').and.returnValue(
        cold('(t|)', { t: true })
      );
      const mockActiveCart = {
        deliveryItemsQuantity: 7,
      } as Partial<Cart>;

      spyOn(activeCartFacade, 'getActive').and.returnValue(
        cold('c', { c: mockActiveCart })
      );
      expect(service.getQuantity()).toBeObservable(
        cold('(ab)', { a: 0, b: 7 })
      );
    });
  });
});
