import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReviewList, Review } from '../../occ/occ-models/occ.models';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';

@Injectable()
export class ProductReviewsLoaderService {
  constructor(
    private http: HttpClient,
    private occEndpoints: OccEndpointsService
  ) {}

  load(productCode: string, maxCount?: number): Observable<ReviewList> {
    return this.http
      .get(this.getEndpoint(productCode, maxCount))
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  post(productCode: string, review: any): Observable<Review> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.append('headline', review.headline);
    body.append('comment', review.comment);
    body.append('rating', review.rating.toString());
    body.append('alias', review.alias);

    return this.http
      .post(this.getEndpoint(productCode), body.toString(), { headers })
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  protected getEndpoint(code: string, maxCount?: number): string {
    return this.occEndpoints.getUrl(
      'productReviews',
      {
        productCode: code
      },
      { maxCount }
    );
  }
}
