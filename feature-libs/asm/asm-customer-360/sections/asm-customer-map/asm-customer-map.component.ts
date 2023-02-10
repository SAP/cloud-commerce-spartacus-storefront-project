/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  AsmCustomer360StoreLocation,
  Customer360SectionConfig,
} from '@spartacus/asm/root';
import {
  PointOfService,
  TranslationService,
  WeekdayOpeningDay,
} from '@spartacus/core';
import {
  StoreFinderSearchPage,
  StoreFinderService,
} from '@spartacus/storefinder/core';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { concatMap, mapTo, take, tap } from 'rxjs/operators';

import { Customer360SectionContext } from '../customer-360-section-context.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-map',
  templateUrl: './asm-customer-map.component.html',
})
export class AsmCustomerMapComponent implements OnDestroy, OnInit {
  storeData: StoreFinderSearchPage;

  googleMapsUrl: SafeResourceUrl;

  selectedStore: PointOfService;

  apiKey: string;

  dataSource$: Observable<
    [Customer360SectionConfig, AsmCustomer360StoreLocation]
  >;

  protected subscription = new Subscription();

  constructor(
    public source: Customer360SectionContext<AsmCustomer360StoreLocation>,
    protected changeDetectorRef: ChangeDetectorRef,
    protected sanitizer: DomSanitizer,
    protected storeFinderService: StoreFinderService,
    protected translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.dataSource$ = combineLatest([this.source.config$, this.source.data$]);

    this.subscription.add(
      this.dataSource$
        .pipe(
          concatMap(([config, data]) => {
            this.storeFinderService.findStoresAction(
              data.address,
              undefined,
              undefined,
              undefined,
              undefined,
              config.storefinderRadius
            );

            return this.storeFinderService.getFindStoresEntities();
          }),
          concatMap((data: any) => {
            if (data) {
              this.storeData = data;
              this.selectedStore = data.stores?.[0];

              return this.updateGoogleMapsUrl();
            } else {
              return of(undefined);
            }
          })
        )
        .subscribe(() => this.changeDetectorRef.detectChanges())
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateGoogleMapsUrl(): Observable<void> {
    return this.dataSource$.pipe(
      take(1),
      tap(([config, data]) => {
        if (config.googleMapsApiKey && this.selectedStore?.geoPoint) {
          const coordinates = `${this.selectedStore.geoPoint.latitude},${this.selectedStore.geoPoint.longitude}`;

          const params = new HttpParams()
            .append('key', config.googleMapsApiKey)
            .append('origin', data.address)
            .append('destination', coordinates);

          this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.google.com/maps/embed/v1/directions?${params.toString()}`
          );

          this.changeDetectorRef.detectChanges();
        }
      }),
      mapTo(undefined)
    );
  }

  selectStore(store: PointOfService): void {
    this.selectedStore = store;

    this.updateGoogleMapsUrl().subscribe(() =>
      this.changeDetectorRef.detectChanges()
    );
  }

  getStoreOpening(opening: WeekdayOpeningDay): Observable<string> {
    const { closed, openingTime, closingTime } = opening;
    if (closed) {
      return this.translationService.translate(
        'asm.customer360.maps.storeClosed'
      );
    } else if (openingTime) {
      let storeOpening = `${openingTime.formattedHour}`;

      if (closingTime) {
        storeOpening = `${storeOpening} - ${closingTime.formattedHour}`;
      }

      return of(storeOpening);
    } else {
      return of('');
    }
  }
}
