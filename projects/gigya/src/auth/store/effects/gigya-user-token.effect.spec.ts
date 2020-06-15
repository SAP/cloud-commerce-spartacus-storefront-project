import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { OCC_USER_ID_CURRENT } from 'projects/core/src/occ';
import { Observable, of } from 'rxjs';
import { GigyaUserAuthenticationTokenService } from '../../services/user-authentication/gigya-user-authentication-token.service';
import { UserToken, GlobalMessageService, ErrorModel } from '@spartacus/core';
import { GigyaUserTokenEffects } from './gigya-user-token.effect';
import { GigyaAuthActions } from '../actions';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const testToken: UserToken = {
  access_token: 'xxx',
  token_type: 'bearer',
  refresh_token: 'xxx',
  expires_in: 1000,
  scope: ['xxx'],
  userId: 'xxx',
};

class GigyaUserAuthenticationTokenServiceMock {
  loadTokenUsingCustomFlow(
    _UID: string,
    _UIDSignature: string,
    _signatureTimestamp: string,
    _idToken: string,
    _baseSite: string
  ): Observable<UserToken> {
    return;
  }
}

class MockGlobalMessageService {
  add(): void {}
}

describe('UserToken effect', () => {
  let userTokenService: GigyaUserAuthenticationTokenService;
  let userTokenEffect: GigyaUserTokenEffects;
  let actions$: Observable<GigyaAuthActions.GigyaUserTokenAction>;
  let globalMessageService: GlobalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GigyaUserTokenEffects,
        {
          provide: GigyaUserAuthenticationTokenService,
          useClass: GigyaUserAuthenticationTokenServiceMock,
        },
        provideMockActions(() => actions$),
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
      ],
    });

    userTokenEffect = TestBed.inject(GigyaUserTokenEffects);
    userTokenService = TestBed.inject(GigyaUserAuthenticationTokenService);
    globalMessageService = TestBed.inject(GlobalMessageService);

    spyOn(globalMessageService, 'add').and.stub();
  });

  describe('loadGigyaUserToken$', () => {
    it('should load a user token', () => {
      spyOn(userTokenService, 'loadTokenUsingCustomFlow').and.returnValue(
        of(testToken)
      );
      const action = new GigyaAuthActions.LoadGigyaUserToken({
        UID: 'xxx',
        UIDSignature: 'xxx',
        signatureTimestamp: 'xxx',
        idToken: 'xxx',
        baseSite: 'xxx',
      });

      const actionPayload = {
        UID: 'xxx',
        UIDSignature: 'xxx',
        signatureTimestamp: 'xxx',
        idToken: 'xxx',
        baseSite: 'xxx',
      };

      const completion = new GigyaAuthActions.LoadUserTokenSuccess({
        token: testToken,
        initActionPayload: actionPayload,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(userTokenEffect.loadGigyaUserToken$).toBeObservable(expected);
      expect(testToken.expiration_time).toBeDefined();
      expect(testToken.userId).toEqual(OCC_USER_ID_CURRENT);
    });

    it('should serialize string error before returning it', () => {
      const errorReturned = userTokenEffect.makeErrorSerializable('error');

      expect(errorReturned).toBeDefined();
    });

    it('should serialize Error before returning it', () => {
      const error = new Error('xxx');
      const errorReturned = userTokenEffect.makeErrorSerializable(error);

      expect(errorReturned).toBeDefined();
    });

    it('should serialize ErrorModel before returning it', () => {
      const error: ErrorModel = {
        message: 'error message',
      };

      const errorReturned = userTokenEffect.makeErrorSerializable(error);

      expect(errorReturned).toBeDefined();
    });

    it('should serialize HttpErrorResponse before returning it', () => {
      const mockError = new HttpErrorResponse({
        error: 'error',
        headers: new HttpHeaders().set('xxx', 'xxx'),
        status: 500,
        statusText: 'Unknown error',
        url: '/xxx',
      });

      const errorReturned = userTokenEffect.makeErrorSerializable(mockError);

      expect(errorReturned).toBeDefined();
    });

    it('should serialize circular HttpErrorResponse before returning it', () => {
      const circular = {
        xxx: 'xxx',
      };
      circular['myself'] = circular;

      const mockError = new HttpErrorResponse({
        error: circular,
        headers: new HttpHeaders().set('xxx', 'xxx'),
        status: 500,
        statusText: 'Unknown error',
        url: '/xxx',
      });

      const errorReturned = userTokenEffect.makeErrorSerializable(mockError);

      expect(errorReturned).toBeDefined();
    });
  });
});
