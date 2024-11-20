/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeoPoint, SearchConfig } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import {
  StoreFinderSearchQuery,
  StoreFinderService,
  StoreFinderConfig,
} from '@spartacus/storefinder/core';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { StoreFinderListComponent } from './store-finder-list/store-finder-list.component';
import { PaginationComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-store-finder-search-result',
  templateUrl: './store-finder-search-result.component.html',
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    PaginationComponent,
    StoreFinderListComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreFinderSearchResultComponent implements OnInit, OnDestroy {
  locations: any;
  subscription: Subscription;
  useMyLocation: boolean;
  countryCode: string = null;
  searchConfig: SearchConfig = {
    currentPage: 0,
  };
  radius: number;
  searchQuery: StoreFinderSearchQuery;
  geolocation: GeoPoint;
  locations$: Observable<any>;
  isLoading$: Observable<any>;

  constructor(
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute,
    protected config: StoreFinderConfig
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe((params) =>
      this.initialize(params)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  viewPage(pageNumber: number) {
    this.searchConfig = { ...this.searchConfig, currentPage: pageNumber };
    this.storeFinderService.findStoresAction(
      this.searchQuery.queryText,
      this.searchConfig,
      this.geolocation,
      this.countryCode,
      this.useMyLocation,
      this.radius
    );
  }

  private initialize(params: Params) {
    this.searchQuery = this.parseParameters(params);
    this.useMyLocation = params && params.useMyLocation ? true : false;
    this.searchConfig = { ...this.searchConfig, currentPage: 0 };
    this.radius = this.config.googleMaps.radius;
    this.storeFinderService.findStoresAction(
      this.searchQuery.queryText,
      this.searchConfig,
      this.geolocation,
      this.countryCode,
      this.useMyLocation,
      this.radius
    );

    this.isLoading$ = this.storeFinderService.getStoresLoading();
    this.locations$ = this.storeFinderService.getFindStoresEntities();
  }

  private parseParameters(queryParams: {
    [key: string]: any;
  }): StoreFinderSearchQuery {
    let searchQuery: StoreFinderSearchQuery;

    if (queryParams.query) {
      searchQuery = { queryText: queryParams.query };
    } else {
      searchQuery = { queryText: '' };
    }

    searchQuery.useMyLocation =
      queryParams.useMyLocation != null &&
      queryParams.useMyLocation.toUpperCase() === 'TRUE';

    return searchQuery;
  }
}
