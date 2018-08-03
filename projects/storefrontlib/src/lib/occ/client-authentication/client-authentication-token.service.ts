import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../../config.service';

const OAUTH_ENDPOINT = '/authorizationserver/oauth/token';

@Injectable()
export class OccClientAuthenticationTokenService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  loadClientAuthenticationToken(): Observable<any> {
    const url = this.getOAuthEndpoint();
    let creds = '';
    creds +=
      'client_id=' + encodeURIComponent(this.config.authentication.client_id);
    creds +=
      '&client_secret=' +
      encodeURIComponent(this.config.authentication.client_secret);
    creds += '&grant_type=client_credentials';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http
      .post(url, creds, { headers })
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  private getOAuthEndpoint() {
    return this.config.server.baseUrl + OAUTH_ENDPOINT;
  }
}
