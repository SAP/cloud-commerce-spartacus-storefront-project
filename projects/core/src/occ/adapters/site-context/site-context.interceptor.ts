import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { CurrencyService } from '../../../site-context/facade/currency.service';
import { LanguageService } from '../../../site-context/facade/language.service';
import { OccConfig } from '../../config/occ-config';
import { OccEndpointsService } from '../../services/occ-endpoints.service';

@Injectable()
export class SiteContextInterceptor implements HttpInterceptor {
  activeLang: string = this.config.site.language;
  activeCurr: string = this.config.site.currency;

  constructor(
    private languageService: LanguageService,
    private currencyService: CurrencyService,
    private occEndpoints: OccEndpointsService,
    private config: OccConfig
  ) {
    this.languageService
      .getActive()
      .subscribe(data => (this.activeLang = data));

    this.currencyService
      .getActive()
      .subscribe(data => (this.activeCurr = data));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(this.occEndpoints.getBaseEndpoint())) {
      request = request.clone({
        setParams: {
          lang: this.activeLang,
          curr: this.activeCurr,
        },
      });
    }

    return next.handle(request);
  }
}
