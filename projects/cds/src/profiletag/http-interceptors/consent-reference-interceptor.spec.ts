import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { OccEndpointsService } from '@spartacus/core';
import { ProfileTagEventService } from '../services/profiletag-event.service';
import { ConsentReferenceInterceptor } from './consent-reference-interceptor';

describe('consent reference interceptor', () => {
  const ProfileTagEventTrackerMock = {
    get latestConsentReference() {
      return null;
    },
  };
  const occEndPointsMock = {
    getBaseEndpoint: () => '/occ',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ProfileTagEventService,
          useValue: ProfileTagEventTrackerMock,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ConsentReferenceInterceptor,
          multi: true,
        },
        {
          provide: OccEndpointsService,
          useValue: occEndPointsMock,
        },
      ],
    });
  });

  it('Should modify the x-consent-reference header if there is a consent-reference', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
      const injectorMock = TestBed.get(ProfileTagEventService as Type<
        ProfileTagEventService
      >);
      injectorMock.latestConsentReference = 'test-123-abc-!@#';
      let response;
      http
        .get('/occ/hasHeader', {
          headers: {
            testHeader: 'test',
          },
        })
        .subscribe(res => (response = res));
      mock
        .expectOne(
          req =>
            req.headers.has('testHeader') &&
            req.headers.has('X-Consent-Reference') &&
            req.headers.get('X-Consent-Reference') === 'test-123-abc-!@#'
        )
        .flush('201 created');
      mock.verify();
      expect(response).toBeTruthy();
    }
  ));

  it('Should not modify the headers if there is not a consent-reference', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
      let response;
      http
        .get('/occ/noHeader', {
          headers: {
            testHeader: 'test',
          },
        })
        .subscribe(res => (response = res));
      mock
        .expectOne(
          req =>
            req.headers.has('testHeader') &&
            !req.headers.has('X-Consent-Reference')
        )
        .flush('201 created');
      mock.verify();
      expect(response).toBeTruthy();
    }
  ));

  it('Should not add the x-consent-reference header if url is not occ', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
      const injector = TestBed.get(ProfileTagEventService as Type<
        ProfileTagEventService
      >);
      injector.profileTagDebug = true;
      let response;
      http
        .get('/hasHeader', {
          headers: {
            testHeader: 'test',
          },
        })
        .subscribe(res => (response = res));
      mock
        .expectOne(
          req =>
            req.headers.has('testHeader') &&
            !req.headers.has('X-Consent-Reference')
        )
        .flush('201 created');
      mock.verify();
      expect(response).toBeTruthy();
    }
  ));

  afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
    verifyNoOpenRequests(mock);
  }));
  function verifyNoOpenRequests(mock: HttpTestingController) {
    mock.verify();
  }
});
