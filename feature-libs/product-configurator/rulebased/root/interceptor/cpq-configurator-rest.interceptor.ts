import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { CpqAccessData } from './cpq-access-data.models';
import { CpqAccessStorageService } from './cpq-access-storage.service';

const HEADER_ATTR_CPQ_SESSION_ID = 'x-cpq-session-id';
const HEADER_ATTR_CPQ_NO_COOKIES = 'x-cpq-disable-cookies';

export const CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT =
  'cpq-configurator-virtual-enpoint';

@Injectable({
  providedIn: 'root',
})
export class CpqConfiguratorRestInterceptor implements HttpInterceptor {
  constructor(protected cpqAccessStorageService: CpqAccessStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT)) {
      return next.handle(request);
    }
    return this.cpqAccessStorageService.getCachedCpqAccessData().pipe(
      take(1), // avoid request being re-executed when token expires
      switchMap((cpqData) => {
        return next.handle(this.enrichHeaders(request, cpqData)).pipe(
          catchError((errorResponse: any) => {
            return this.handleError(errorResponse, next, request);
          }),
          tap((response) => this.extractCpqSessionId(response, cpqData))
        );
      })
    );
  }

  protected handleError(
    errorResponse: any,
    next: HttpHandler,
    request: HttpRequest<any>
  ) {
    if (errorResponse instanceof HttpErrorResponse) {
      if (errorResponse.status === 403) {
        this.cpqAccessStorageService.renewCachedCpqAccessData();
        return this.cpqAccessStorageService.getCachedCpqAccessData().pipe(
          take(1),
          switchMap((newCpqData) => {
            return next.handle(this.enrichHeaders(request, newCpqData));
          })
        );
      }
    }
    return throwError(errorResponse); //propagate error
  }

  protected extractCpqSessionId(
    response: HttpEvent<any>,
    cpqData: CpqAccessData
  ) {
    if (
      response instanceof HttpResponse ||
      response instanceof HttpErrorResponse
    ) {
      if (response.headers.has(HEADER_ATTR_CPQ_SESSION_ID)) {
        cpqData.cpqSessionId = response.headers.get(HEADER_ATTR_CPQ_SESSION_ID);
      }
    }
  }

  protected enrichHeaders(
    request: HttpRequest<any>,
    cpqData: CpqAccessData
  ): HttpRequest<any> {
    let newRequest = request.clone({
      url: request.url.replace(
        CPQ_CONFIGURATOR_VIRTUAL_ENDPOINT,
        cpqData.endpoint
      ),
      setHeaders: {
        Authorization: 'Bearer ' + cpqData.accessToken,
        [HEADER_ATTR_CPQ_NO_COOKIES]: 'true',
      },
    });
    if (cpqData.cpqSessionId) {
      newRequest = newRequest.clone({
        setHeaders: {
          [HEADER_ATTR_CPQ_SESSION_ID]: cpqData.cpqSessionId,
        },
      });
    }
    return newRequest;
  }
}
