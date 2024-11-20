/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointOfServiceStock } from '@spartacus/core';
import {
  IntendedPickupLocationFacade,
  PickupLocationsSearchFacade,
} from '@spartacus/pickup-in-store/root';
import { Observable } from 'rxjs';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { StoreComponent } from '../../presentational/store/store.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

/**
 * The list of stores with their stock level and distance from a searched location.
 * Used in the PickupOptionDialog component for selecting a pickup location.
 */
@Component({
  selector: 'cx-store-list',
  templateUrl: 'store-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    StoreComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreListComponent implements OnInit {
  /** The product code for the stock levels at each location */
  @Input() productCode: string;
  /** Event emitter triggered when a store is selected for pickup */
  @Output() storeSelected: EventEmitter<null> = new EventEmitter<null>();

  stores$: Observable<PointOfServiceStock[]>;
  hasSearchStarted$: Observable<boolean>;
  isSearchRunning$: Observable<boolean>;

  constructor(
    protected intendedPickupLocationService: IntendedPickupLocationFacade,
    protected pickupLocationsSearchService: PickupLocationsSearchFacade
  ) {
    // Intentional empty constructor
  }

  ngOnInit() {
    this.stores$ = this.pickupLocationsSearchService.getSearchResults(
      this.productCode
    );
    this.hasSearchStarted$ = this.pickupLocationsSearchService.hasSearchStarted(
      this.productCode
    );
    this.isSearchRunning$ = this.pickupLocationsSearchService.isSearchRunning();
  }

  /**
   * Select the store to pickup from. This also sets the user's preferred store
   * the selected point of service.
   *
   * @param store Store to pickup from
   */
  onSelectStore(store: PointOfServiceStock) {
    const { stockInfo: _, ...pointOfService } = store;

    this.intendedPickupLocationService.setIntendedLocation(this.productCode, {
      ...pointOfService,
      pickupOption: 'pickup',
    });

    this.storeSelected.emit();
  }
}
