import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  SearchConfig,
  StoreFinderSearchQuery,
  StoreFinderService,
  GeoPoint,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'cx-store-finder-search-result',
  templateUrl: './store-finder-search-result.component.html',
})
export class StoreFinderSearchResultComponent implements OnInit, OnDestroy {
  locations: any;
  searchQuery: StoreFinderSearchQuery;
  locations$: Observable<any>;
  isLoading$: Observable<any>;
  geolocation: GeoPoint;
  subscription: Subscription;
  searchConfig: SearchConfig = {
    currentPage: 0,
  };

  constructor(
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.initialize(params));
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
      this.geolocation,
      this.searchConfig
    );
  }

  private initialize(params: Params) {
    this.searchQuery = this.parseParameters(params);
    this.storeFinderService.findStoresAction(
      this.searchQuery.queryText,
      this.geolocation,
      this.searchConfig
    );

    this.isLoading$ = this.storeFinderService.getStoresLoading();
    this.locations$ = this.storeFinderService.getFindStoresEntities();
    this.subscription = this.locations$
      .pipe(
        filter(Boolean),
        map(data => data.longitudeLatitude)
      )
      .subscribe(geoData => (this.geolocation = geoData));
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
