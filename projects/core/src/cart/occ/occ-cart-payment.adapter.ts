import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PaymentDetails } from '../../occ/occ-models/occ.models';
import { CustomEncoder } from './custom.encoder';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { CartPaymentAdapter } from '../connectors/payment/cart-payment.adapter';

@Injectable()
export class OccCartPaymentAdapter implements CartPaymentAdapter {
  constructor(
    protected http: HttpClient,
    private occEndpoints: OccEndpointsService
  ) {}

  protected getCartEndpoint(userId: string): string {
    const cartEndpoint = 'users/' + userId + '/carts/';
    return this.occEndpoints.getEndpoint(cartEndpoint);
  }

  public getProviderSubInfo(userId: string, cartId: string): Observable<any> {
    return this.http
      .get(
        this.getCartEndpoint(userId) +
          cartId +
          '/payment/sop/request?responseUrl=sampleUrl'
      )
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  public createSubWithProvider(
    postUrl: string,
    parameters: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/html',
    });
    let httpParams = new HttpParams({ encoder: new CustomEncoder() });
    Object.keys(parameters).forEach(key => {
      httpParams = httpParams.append(key, parameters[key]);
    });

    return this.http.post(postUrl, httpParams, {
      headers,
      responseType: 'text',
    });
  }

  public createDetails(
    userId: string,
    cartId: string,
    parameters: any
  ): Observable<PaymentDetails> {
    let httpParams = new HttpParams({ encoder: new CustomEncoder() });
    Object.keys(parameters).forEach(key => {
      httpParams = httpParams.append(key, parameters[key]);
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<PaymentDetails>(
        this.getCartEndpoint(userId) + cartId + '/payment/sop/response',
        httpParams,
        { headers }
      )
      .pipe(catchError((error: any) => throwError(error)));
  }

  public setDetails(
    userId: string,
    cartId: string,
    paymentDetailsId: any
  ): Observable<any> {
    return this.http
      .put(
        this.getCartEndpoint(userId) + cartId + '/paymentdetails',
        {},
        {
          params: { paymentDetailsId: paymentDetailsId },
        }
      )
      .pipe(catchError((error: any) => throwError(error.json())));
  }
}
