/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BundleAdapter, BundleStarter } from '@spartacus/cart/bundle/core';
import {
  ConverterService,
  OccEndpointsService,
  PRODUCT_SEARCH_PAGE_NORMALIZER,
  SearchConfig,
} from '@spartacus/core';
import { Observable } from 'rxjs';

@Injectable()
export class OccBundleAdapter implements BundleAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {}

  /**
   * Starts a bundle once the productCode, its quantity, and a bundle templateId is provided. A successful result returns a CartModification response.
   *
   * @param userId
   * User identifier or one of the literals : ‘current’ for currently authenticated user, ‘anonymous’ for anonymous user.
   *
   * @param cartId
   * Cart code for logged in user, cart guid for anonymous user, ‘current’ for the last modified cart.
   *
   * @param bundleStarter
   * Mandatory data required to start a bundle. This includes the templateId of the bundle, the productCode, and the quantity of the product itself.
   */
  public bundleStart(
    userId: string,
    cartId: string,
    bundleStarter: BundleStarter
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.buildUrl('bundleStart', {
      urlParams: {
        userId,
        cartId,
      },
    });

    return this.http.post<any>(url, <HttpParams>bundleStarter, { headers });
  }

  /**
   * Returns products and additional data based on the entry group and search query provided.
   *
   * @param userId
   * User identifier or one of the literals : ‘current’ for currently authenticated user, ‘anonymous’ for anonymous user.
   *
   * @param cartId
   * Cart code for logged in user, cart guid for anonymous user, ‘current’ for the last modified cart
   *
   * @param entryGroupNumber
   * Each entry group in a cart has a specific entry group number. Entry group numbers are integers starting at one. They are defined in ascending order.
   *
   * @param searchConfig
   * Options for search.
   */
  public bundleAllowedProductsSearch(
    userId: string,
    cartId: string,
    entryGroupNumber: number,
    searchConfig?: SearchConfig
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.buildUrl(
      'bundleAllowedProductsSearch',
      {
        urlParams: {
          userId,
          cartId,
          entryGroupNumber,
        },
      }
    );

    return this.http
      .get<any>(url, {
        headers,
        params: <HttpParams>searchConfig,
      })
      .pipe(this.converterService.pipeable(PRODUCT_SEARCH_PAGE_NORMALIZER));
  }
}
