import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import {
  ErrorModel,
  HttpErrorHandler,
  Priority,
  HttpResponseStatus,
  GlobalMessageType,
} from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class OrganizationUserRegistrationConflictHandler extends HttpErrorHandler {
  responseStatus = HttpResponseStatus.CONFLICT;

  handleError(request: HttpRequest<any>, response: HttpErrorResponse) {
    if (request && this.getErrors(response)?.length) {
      this.globalMessageService.add(
        { key: 'userRegistrationForm.httpHandlers.conflict' },
        GlobalMessageType.MSG_TYPE_ERROR
      );
    }
  }

  protected getErrors(response: HttpErrorResponse): ErrorModel[] {
    return (response.error?.errors).filter(
      (error: any) => error?.type === 'AlreadyExistsError'
    );
  }

  getPriority(): Priority {
    return Priority.NORMAL;
  }
}
