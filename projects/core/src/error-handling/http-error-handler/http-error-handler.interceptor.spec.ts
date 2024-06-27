import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, throwError } from 'rxjs';
import { FeatureConfigService } from '../../features-config';
import { WindowRef } from '../../window';
import { HttpErrorHandlerInterceptor } from './http-error-handler.interceptor';

@Injectable()
class MockErrorHandler {
  handleError(_error: any): void {}
}

describe('HttpErrorHandlerInterceptor', () => {
  let interceptor: HttpErrorHandlerInterceptor;
  let errorHandler: ErrorHandler;
  let request: HttpRequest<any>;
  let next: HttpHandler;
  let featureConfigService: FeatureConfigService;
  let windowRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpErrorHandlerInterceptor,
        FeatureConfigService,
        { provide: WindowRef, useValue: { isBrowser: () => false } },
        { provide: ErrorHandler, useClass: MockErrorHandler },
      ],
    });

    interceptor = TestBed.inject(HttpErrorHandlerInterceptor);
    errorHandler = TestBed.inject(ErrorHandler);
    featureConfigService = TestBed.inject(FeatureConfigService);
    windowRef = TestBed.inject(WindowRef);

    request = new HttpRequest('GET', 'test-url');
    next = {
      handle: () => new Observable<HttpEvent<any>>(),
    } as HttpHandler;
  });

  it('should create the interceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('when ssrStrictErrorHandlingForHttpAndNgrx is enabled', () => {
    beforeEach(() => {
      spyOn(featureConfigService, 'isEnabled').and.returnValue(true);
    });
    it('should call handleError on error', (done) => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'error',
      });
      spyOn(errorHandler, 'handleError');

      next.handle = () => throwError(() => error);

      interceptor.intercept(request, next).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(errorHandler.handleError).toHaveBeenCalledWith(error);
          done();
        },
      });
    });

    it('should not call handleError when it is not SSR', (done) => {
      spyOn(errorHandler, 'handleError');
      spyOn(windowRef, 'isBrowser').and.returnValue(true);

      next.handle = () => throwError(() => new HttpErrorResponse({}));

      interceptor.intercept(request, next).subscribe({
        error: () => {
          expect(errorHandler.handleError).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should pass through the request when there is no error', (done) => {
      const response: HttpEvent<any> = {
        status: 200,
        statusText: 'ok',
      } as HttpEvent<any>;
      next.handle = () =>
        new Observable<HttpEvent<any>>((observer) => observer.next(response));

      interceptor.intercept(request, next).subscribe((result) => {
        expect(result).toBe(response);
        done();
      });
    });
  });

  describe('when ssrStrictErrorHandlingForHttpAndNgrx is disabled', () => {
    beforeEach(() => {
      spyOn(featureConfigService, 'isEnabled').and.returnValue(false);
    });

    it('should pass through the request when there is an error', (done) => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'error',
      });
      spyOn(errorHandler, 'handleError');

      next.handle = () => throwError(() => error);

      interceptor.intercept(request, next).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
          expect(errorHandler.handleError).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
