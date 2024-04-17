/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdsEndpointsService } from '../services';
import { CdsConfig } from '../config';
import { BaseSiteService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { SearchPhrases } from './trending-searches.component';

const TRENDING_SEARCHES_ENDPOINT_KEY = 'searchIntelligence';

@Injectable({
  providedIn: 'root',
})
export class TrendingSearchesService {
  constructor(
    private httpClient: HttpClient,
    private cdsEndpointsService: CdsEndpointsService,
    private cdsConfig: CdsConfig,
    private baseSiteService: BaseSiteService
  ) {}

  getTrendingSearches(): Observable<SearchPhrases[]> {
    return new Observable((observer) => {
      this.baseSiteService.getActive().subscribe((currentSite: string) => {
        const originalEndpointUrl = this.cdsEndpointsService.getUrl(
          TRENDING_SEARCHES_ENDPOINT_KEY
        );
        const httpsPrefix = `https://${this.cdsConfig.cds.tenant}-${currentSite}.`;
        const modifiedUrl = originalEndpointUrl.replace(
          /https:\/\//g,
          httpsPrefix
        );

        this.httpClient.get<any>(modifiedUrl).subscribe((data) => {
          observer.next(data?.searchPhrases);
          observer.complete();
        });
      });
    });
  }
}
