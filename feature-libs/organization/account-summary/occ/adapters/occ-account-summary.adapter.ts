import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConverterService,
  normalizeHttpError,
  OccEndpointsService,
} from '@spartacus/core';
import {
  AccountSummaryAdapter,
  ACCOUNT_SUMMARY_DOCUMENT_NORMALIZER,
  ACCOUNT_SUMMARY_NORMALIZER,
} from '@spartacus/organization/account-summary/core';
import {
  AccountSummaryDetails,
  AccountSummaryList,
  DocumentQueryParams,
} from '@spartacus/organization/account-summary/root';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OccAccountSummaryAdapter implements AccountSummaryAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  getAccountSummary(
    userId: string,
    orgUnit: string
  ): Observable<AccountSummaryDetails> {
    return this.http
      .get<AccountSummaryDetails>(this.buildAccountSummaryUrl(userId, orgUnit))
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(normalizeHttpError(error))
        ),
        this.converter.pipeable(ACCOUNT_SUMMARY_NORMALIZER)
      );
  }

  getDocumentList(
    userId: string,
    orgUnit: string,
    params: DocumentQueryParams
  ): Observable<AccountSummaryList> {
    return this.http
      .get<AccountSummaryList>(
        this.buildDocumentListUrl(userId, orgUnit, params)
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(normalizeHttpError(error))
        ),
        this.converter.pipeable(ACCOUNT_SUMMARY_DOCUMENT_NORMALIZER)
      );
  }

  getDocumentAttachment(
    userId: string,
    orgUnitId: string,
    orgDocumentId: string,
    orgDocumentAttachmentId: string
  ): Observable<Blob> {
    const options = {
      responseType: 'blob' as 'json',
    };

    return this.http
      .get<Blob>(
        this.buildDocumentAttachmentUrl(
          userId,
          orgUnitId,
          orgDocumentId,
          orgDocumentAttachmentId
        ),
        options
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(normalizeHttpError(error))
        )
      );
  }

  private buildAccountSummaryUrl(userId: string, orgUnitId: string): string {
    return this.occEndpoints.buildUrl('accountSummary', {
      urlParams: { userId, orgUnitId },
    });
  }

  private buildDocumentListUrl(
    userId: string,
    orgUnitId: string,
    queryParams: DocumentQueryParams
  ): string {
    return this.occEndpoints.buildUrl('accountSummaryDocument', {
      urlParams: { userId, orgUnitId },
      queryParams,
    });
  }

  private buildDocumentAttachmentUrl(
    userId: string,
    orgUnitId: string,
    orgDocumentId: string,
    orgDocumentAttachmentId: string
  ): string {
    return this.occEndpoints.buildUrl('accountSummaryDocumentAttachment', {
      urlParams: { userId, orgUnitId, orgDocumentId, orgDocumentAttachmentId },
    });
  }
}
