import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Address, AddressValidation } from '../../model/address.model';
import { User } from '../../model/misc.model';
import {
  ConsentTemplate,
  ConsentTemplateList,
} from '../../occ/occ-models/additional-occ.models';
import { Occ } from '../../occ/occ-models/occ.models';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import {
  InterceptorUtil,
  USE_CLIENT_TOKEN,
} from '../../occ/utils/interceptor-util';
import { UserRegisterFormData } from '../model/user.model';

const USER_ENDPOINT = 'users/';
const ADDRESSES_VERIFICATION_ENDPOINT = '/addresses/verification';
const ADDRESSES_ENDPOINT = '/addresses';
const PAYMENT_DETAILS_ENDPOINT = '/paymentdetails';
const FORGOT_PASSWORD_ENDPOINT = '/forgottenpasswordtokens';
const RESET_PASSWORD_ENDPOINT = '/resetpassword';
const UPDATE_EMAIL_ENDPOINT = '/login';
const UPDATE_PASSWORD_ENDPOINT = '/password';
const CONSENTS_TEMPLATES_ENDPOINT = '/consenttemplates';
const CONSENTS_ENDPOINT = '/consents';

@Injectable()
export class OccUserService {
  // some extending from baseservice is not working here...
  constructor(
    protected http: HttpClient,
    private occEndpoints: OccEndpointsService
  ) {}

  loadUser(userId: string): Observable<User> {
    const url = this.getUserEndpoint() + userId;
    return this.http
      .get<User>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateUserDetails(username: string, user: User): Observable<{}> {
    const url = this.getUserEndpoint() + username;
    return this.http
      .patch(url, user)
      .pipe(catchError(error => throwError(error)));
  }

  verifyAddress(
    userId: string,
    address: Address
  ): Observable<AddressValidation> {
    const url =
      this.getUserEndpoint() + userId + ADDRESSES_VERIFICATION_ENDPOINT;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<AddressValidation>(url, address, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  loadUserAddresses(userId: string): Observable<Occ.AddressList> {
    const url = this.getUserEndpoint() + userId + ADDRESSES_ENDPOINT;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<Occ.AddressList>(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  addUserAddress(userId: string, address: Address): Observable<{}> {
    const url = this.getUserEndpoint() + userId + ADDRESSES_ENDPOINT;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(url, address, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateUserAddress(
    userId: string,
    addressId: string,
    address: Address
  ): Observable<{}> {
    const url =
      this.getUserEndpoint() + userId + ADDRESSES_ENDPOINT + '/' + addressId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .patch(url, address, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteUserAddress(userId: string, addressId: string): Observable<{}> {
    const url =
      this.getUserEndpoint() + userId + ADDRESSES_ENDPOINT + '/' + addressId;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  loadUserPaymentMethods(userId: string): Observable<Occ.PaymentDetailsList> {
    const url = `${this.getUserEndpoint()}${userId}${PAYMENT_DETAILS_ENDPOINT}?saved=true`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<Occ.PaymentDetailsList>(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  deleteUserPaymentMethod(
    userId: string,
    paymentMethodID: string
  ): Observable<{}> {
    const url = `${this.getUserEndpoint()}${userId}${PAYMENT_DETAILS_ENDPOINT}/${paymentMethodID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  setDefaultUserPaymentMethod(
    userId: string,
    paymentMethodID: string
  ): Observable<{}> {
    const url = `${this.getUserEndpoint()}${userId}${PAYMENT_DETAILS_ENDPOINT}/${paymentMethodID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .patch(
        url,
        // TODO: Remove billingAddress property
        { billingAddress: { titleCode: 'mr' }, defaultPayment: true },
        { headers }
      )
      .pipe(catchError((error: any) => throwError(error)));
  }

  registerUser(user: UserRegisterFormData): Observable<User> {
    const url: string = this.getUserEndpoint();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    return this.http
      .post<User>(url, user, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  requestForgotPasswordEmail(userEmailAddress: string): Observable<{}> {
    const url = this.occEndpoints.getEndpoint(FORGOT_PASSWORD_ENDPOINT);
    const httpParams: HttpParams = new HttpParams().set(
      'userId',
      userEmailAddress
    );
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http
      .post(url, httpParams, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  resetPassword(token: string, newPassword: string): Observable<{}> {
    const url = this.occEndpoints.getEndpoint(RESET_PASSWORD_ENDPOINT);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    return this.http
      .post(url, { token, newPassword }, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  removeUser(userId: string): Observable<{}> {
    const url = this.getUserEndpoint() + userId;
    return this.http
      .delete<User>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  updateEmail(
    userId: string,
    currentPassword: string,
    newUserId: string
  ): Observable<{}> {
    const url = this.getUserEndpoint() + userId + UPDATE_EMAIL_ENDPOINT;
    const httpParams: HttpParams = new HttpParams()
      .set('password', currentPassword)
      .set('newLogin', newUserId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .put(url, httpParams, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  protected getUserEndpoint(): string {
    return this.occEndpoints.getEndpoint(USER_ENDPOINT);
  }

  updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Observable<{}> {
    const url = this.getUserEndpoint() + userId + UPDATE_PASSWORD_ENDPOINT;
    const httpParams: HttpParams = new HttpParams()
      .set('old', oldPassword)
      .set('new', newPassword);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .put(url, httpParams, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  loadConsents(userId: string): Observable<ConsentTemplateList> {
    const url = this.getUserEndpoint() + userId + CONSENTS_TEMPLATES_ENDPOINT;
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    return this.http
      .get<ConsentTemplateList>(url, { headers })
      .pipe(catchError((error: any) => throwError(error)));
  }

  giveConsent(
    userId: string,
    consentTemplateId: string,
    consentTemplateVersion: number
  ): Observable<ConsentTemplate> {
    const url = this.getUserEndpoint() + userId + CONSENTS_ENDPOINT;
    const httpParams = new HttpParams()
      .set('consentTemplateId', consentTemplateId)
      .set('consentTemplateVersion', consentTemplateVersion.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    });
    return this.http
      .post<ConsentTemplate>(url, httpParams, { headers })
      .pipe(catchError(error => throwError(error)));
  }

  withdrawConsent(userId: string, consentCode: string): Observable<{}> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
    });
    const url =
      this.getUserEndpoint() + userId + CONSENTS_ENDPOINT + '/' + consentCode;
    return this.http.delete(url, { headers });
  }
}
