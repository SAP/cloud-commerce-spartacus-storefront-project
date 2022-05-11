import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ConverterService,
  InterceptorUtil,
  normalizeHttpError,
  OccEndpointsService,
  USE_CLIENT_TOKEN,
} from '@spartacus/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ORGANIZATION_USER_REGISTRATION_SERIALIZER,
  UserRegistrationAdapter,
} from '../../core/connectors';
import { OrganizationUserRegistration } from '../../core/model/user-registration.model';

@Injectable()
export class OccUserRegistrationAdapter implements UserRegistrationAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  registerUser(
    userData: OrganizationUserRegistration
  ): Observable<OrganizationUserRegistration> {
    const url: string = this.getOrganizationUserRegistrationEndpoint();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    userData = this.converter.convert(
      userData,
      ORGANIZATION_USER_REGISTRATION_SERIALIZER
    );

    return this.http
      .post<OrganizationUserRegistration>(url, userData, { headers })
      .pipe(catchError((error) => throwError(normalizeHttpError(error))));
  }

  protected getOrganizationUserRegistrationEndpoint(): string {
    return this.occEndpoints.buildUrl('organizationUserRegistration');
  }
}
