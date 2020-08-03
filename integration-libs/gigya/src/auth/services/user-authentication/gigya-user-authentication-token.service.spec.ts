import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GigyaUserAuthenticationTokenService } from './gigya-user-authentication-token.service';
import { OccEndpointsService, AuthConfig, UserToken } from '@spartacus/core';
import { HttpErrorResponse } from '@angular/common/http';

const UID = 'sampleUID';
const UIDSignature = 'sampleUIDSignature';
const idToken = 'sampleIdToken';
const signatureTimestamp = 'sampleSignatureTimestamp';
const baseSite = 'sampleBaseSite';

const loginEndpoint = '/authorizationserver/oauth/token';

const token: UserToken = {
  access_token: 'mockToken',
  token_type: 'mock',
  refresh_token: '',
  expires_in: 12342,
  scope: ['mock', 'scope'],
  userId: 'dsfk32df34',
};

const MockAuthConfig: AuthConfig = {
  authentication: {
    client_id: '',
    client_secret: '',
  },
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
      endpoints: {
        login: loginEndpoint,
      },
    },
  },
};

class MockOccEndpointsService {
  getRawEndpoint(endpoint: string) {
    return (
      MockAuthConfig.backend.occ.baseUrl +
      MockAuthConfig.backend.occ.endpoints[endpoint]
    );
  }
}

describe('GigyaUserAuthenticationTokenService', () => {
  let authTokenService: GigyaUserAuthenticationTokenService;
  let httpMock: HttpTestingController;
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GigyaUserAuthenticationTokenService,
        { provide: AuthConfig, useValue: MockAuthConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
      ],
    });

    authTokenService = TestBed.inject(GigyaUserAuthenticationTokenService);
    httpMock = TestBed.inject(HttpTestingController);
    occEndpointsService = TestBed.inject(OccEndpointsService);
    spyOn(occEndpointsService, 'getRawEndpoint').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authTokenService).toBeTruthy();
  });

  describe('load user token using custom flow', () => {
    it('should load user token for given username and password', () => {
      authTokenService
        .loadTokenUsingCustomFlow(
          UID,
          UIDSignature,
          signatureTimestamp,
          idToken,
          baseSite
        )
        .subscribe((result) => {
          expect(result).toEqual(token);
        });

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(occEndpointsService.getRawEndpoint).toHaveBeenCalledWith('login');
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
    });

    it('should throw error for invalid custom flow invocation', () => {
      authTokenService
        .loadTokenUsingCustomFlow(
          UID,
          UIDSignature,
          signatureTimestamp,
          idToken,
          baseSite
        )
        .subscribe(
          (_result) => {},
          (error: HttpErrorResponse) => {
            expect(error.status).toBe(400);
            expect(error.statusText).toEqual('Error');
          }
        );

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST' && req.url === loginEndpoint;
      });

      expect(occEndpointsService.getRawEndpoint).toHaveBeenCalledWith('login');
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({ status: 400, statusText: 'Error' });
    });
  });
});
