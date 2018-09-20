import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as fromRoot from './../../routing/store';
import * as fromStore from './../../auth/store';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

const mockUserValidToken = {
  access_token: 'Mock Access Token'
};

const mockUserInvalidToken = {};
const mockRouter = { navigate: jasmine.createSpy('navigate') };
const mockActivatedRouteSnapshot = {};
const mockRouterStateSnapshot = { url: '/test' };

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router;
  let activatedRouteSnapshot;
  let routerStateSnapshot;
  let store: Store<fromStore.AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRouteSnapshot,
          useValue: mockActivatedRouteSnapshot
        },
        {
          provide: RouterStateSnapshot,
          useValue: mockRouterStateSnapshot
        }
      ],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          auth: combineReducers(fromStore.getReducers())
        })
      ]
    });
    store = TestBed.get(Store);
    authGuard = TestBed.get(AuthGuard);
    router = TestBed.get(Router);
    activatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);
    routerStateSnapshot = TestBed.get(RouterStateSnapshot);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should return false', () => {
    spyOn(store, 'select').and.returnValue(of(mockUserInvalidToken));

    let result: boolean;

    const sub = authGuard
      .canActivate(activatedRouteSnapshot, routerStateSnapshot)
      .subscribe(value => (result = value));
    sub.unsubscribe();
    expect(result).toBe(false);
  });

  it('should return true', () => {
    spyOn(store, 'select').and.returnValue(of(mockUserValidToken));

    let result: boolean;

    const sub = authGuard
      .canActivate(activatedRouteSnapshot, routerStateSnapshot)
      .subscribe(value => (result = value));
    sub.unsubscribe();
    expect(result).toBe(true);
  });

  it('should redirect to login if invalid token', () => {
    spyOn(store, 'select').and.returnValue(of(mockUserInvalidToken));
    const sub = authGuard
      .canActivate(activatedRouteSnapshot, routerStateSnapshot)
      .subscribe();
    sub.unsubscribe();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(store.dispatch).toHaveBeenCalledWith(
      new fromRoot.SaveRedirectUrl('/test')
    );
  });
});
