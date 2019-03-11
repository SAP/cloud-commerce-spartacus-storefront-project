import { Injectable } from '@angular/core';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorHandler } from './http-error.handler';
import { GlobalMessageType } from '../../models/global-message.model';
import { HttpResponseStatus } from '../../models/response-status.model';

const OAUTH_ENDPOINT = '/authorizationserver/oauth/token';

@Injectable({
  providedIn: 'root'
})
export class BadRequestHandler extends HttpErrorHandler {
  responseStatus = HttpResponseStatus.BAD_REQUEST;

  handleError(request: HttpRequest<any>, response: HttpErrorResponse) {
    if (
      response.url.indexOf(OAUTH_ENDPOINT) !== -1 &&
      response.error.error === 'invalid_grant'
    ) {
      if (request.body.get('grant_type') === 'password') {
        this.globalMessageService.add({
          type: GlobalMessageType.MSG_TYPE_ERROR,
          text: this.getErrorMessage(response) + '. Please login again.'
        });
        this.globalMessageService.remove(
          GlobalMessageType.MSG_TYPE_CONFIRMATION
        );
      }
    } else {
      // this is currently showing up in case we have a page not found. It should be a 404.
      // see https://jira.hybris.com/browse/CMSX-8516
      this.globalMessageService.add({
        type: GlobalMessageType.MSG_TYPE_ERROR,
        text: this.getErrorMessage(response)
      });
    }
  }

  protected getErrorMessage(resp: HttpErrorResponse) {
    let errMsg = resp.message;
    if (resp.error) {
      if (resp.error.errors && resp.error.errors instanceof Array) {
        errMsg = resp.error.errors[0].message;
      } else if (resp.error.error_description) {
        errMsg = resp.error.error_description;
      }
    }

    return errMsg || 'An unknown error occured';
  }
}
