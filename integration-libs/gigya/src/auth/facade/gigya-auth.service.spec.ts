import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  AuthActions,
  AuthState,
  AUTH_FEATURE,
  OCC_USER_ID_CURRENT,
  UserToken,
  WindowRef,
} from '@spartacus/core';
import { of } from 'rxjs';
import { GigyaAuthActions } from '../store';
import { GigyaAuthService } from './gigya-auth.service';

const mockToken = {
  userId: 'user@sap.com',
  refresh_token: 'foo',
  access_token: 'testToken-access-token',
} as UserToken;

const gigya = {
  accounts: {
    logout: (): void => {},
  },
};

const mockedWindowRef = {
  nativeWindow: {
    gigya: gigya,
  },
};

describe('GigyaAuthService', () => {
  let service: GigyaAuthService;
  let store: Store<AuthState>;
  let winRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(AUTH_FEATURE, (() => ({}))()),
      ],
      providers: [
        GigyaAuthService,
        { provide: WindowRef, useValue: mockedWindowRef },
      ],
    });

    service = TestBed.inject(GigyaAuthService);
    winRef = TestBed.inject(WindowRef);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch proper action for authorize', () => {
    spyOn(store, 'dispatch').and.stub();

    service.authorizeWithCustomGigyaFlow(
      'UID',
      'UIDSignature',
      'signatureTimestamp',
      'idToken',
      'baseSite'
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new GigyaAuthActions.LoadGigyaUserToken({
        UID: 'UID',
        UIDSignature: 'UIDSignature',
        signatureTimestamp: 'signatureTimestamp',
        idToken: 'idToken',
        baseSite: 'baseSite',
      })
    );
  });

  it('should dispatch proper actions for logout standard customer', () => {
    spyOn(store, 'dispatch').and.stub();
    const testToken = { ...mockToken, userId: OCC_USER_ID_CURRENT };
    spyOn(service, 'getUserToken').and.returnValue(of(testToken));
    spyOn(service, 'logoutFromGigya').and.stub();
    service.logout();
    expect(store.dispatch).toHaveBeenCalledWith(new AuthActions.Logout());
    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.RevokeUserToken(testToken)
    );
    expect(service.logoutFromGigya).toHaveBeenCalled();
  });

  it('should logout user from gigya', () => {
    const gigyaLogout = spyOn(
      winRef.nativeWindow['gigya'].accounts,
      'logout'
    ).and.stub();
    service.logoutFromGigya();

    expect(gigyaLogout).toHaveBeenCalled();
  });
});
