import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpResponseStatus } from '../models/response-status.model';
import {
  BadGatewayHandler,
  BadRequestHandler,
  ConflictHandler,
  ForbiddenHandler,
  GatewayTimeoutHandler,
  HttpErrorHandler,
  NotFoundHandler,
  UnknownErrorHandler,
} from './handlers';
import { HttpErrorInterceptor } from './http-error.interceptor';
import createSpy = jasmine.createSpy;

fdescribe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let mockMessageService: any;
  let http: HttpClient;

  beforeEach(() => {
    mockMessageService = {
      add: createSpy(),
      remove: createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useClass: HttpErrorHandler,
          multi: true,
        },
        BadGatewayHandler,
        BadRequestHandler,
        ConflictHandler,
        ForbiddenHandler,
        GatewayTimeoutHandler,
        NotFoundHandler,
        UnknownErrorHandler,
        {
          provide: HttpErrorHandler,
          useExisting: UnknownErrorHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: BadGatewayHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: BadRequestHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: ConflictHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: ForbiddenHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: GatewayTimeoutHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: NotFoundHandler,
          multi: true,
        },
        { provide: GlobalMessageService, useValue: mockMessageService },
      ],
    });

    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  });

  describe('Error Handlers', () => {
    function testHandlers(handlerClass, responseStatus) {
      it('should call handleError for ' + handlerClass.name, function() {
        http
          .get('/123')
          .pipe(catchError((error: any) => throwError(error)))
          .subscribe(_result => {}, error => (this.error = error));
        const mockReq = httpMock.expectOne(req => {
          return req.method === 'GET';
        });

        const handler = TestBed.get(handlerClass);

        spyOn(handler, 'handleError');
        mockReq.flush({}, { status: responseStatus, statusText: '' });

        expect(handler.handleError).toHaveBeenCalled();
      });
    }

    testHandlers(UnknownErrorHandler, HttpResponseStatus.UNKNOWN);
    testHandlers(BadGatewayHandler, HttpResponseStatus.BAD_GATEWAY);
    testHandlers(BadRequestHandler, HttpResponseStatus.BAD_REQUEST);
    testHandlers(ConflictHandler, HttpResponseStatus.CONFLICT);
    testHandlers(ForbiddenHandler, HttpResponseStatus.FORBIDDEN);
    testHandlers(GatewayTimeoutHandler, HttpResponseStatus.GATEWAY_TIMEOUT);
    testHandlers(NotFoundHandler, HttpResponseStatus.NOT_FOUND);
  });

  describe('GlobalMessageServices', () => {
    it(`should display "An unknown error occured" in global message service`, () => {
      http
        .get('/unknown')
        .pipe(catchError((error: any) => throwError(error)))
        .subscribe(_result => {}, error => (this.error = error));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET';
      });

      mockReq.flush({}, { status: 123, statusText: 'unknown' });
      expect(mockMessageService.add).toHaveBeenCalledWith({
        type: GlobalMessageType.MSG_TYPE_ERROR,
        text: 'An unknown error occured',
      });
    });
  });
});
