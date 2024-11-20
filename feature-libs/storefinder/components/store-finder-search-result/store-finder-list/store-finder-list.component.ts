/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DOCUMENT,
  NgIf,
  NgFor,
  NgClass,
  NgSwitch,
  NgSwitchCase,
  KeyValuePipe,
} from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { PointOfService } from '@spartacus/core';
import { StoreFinderMapComponent } from '../../store-finder-map/store-finder-map.component';
import { ICON_TYPE } from '@spartacus/storefront';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { LocationDisplayMode } from './store-finder-list.model';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { StoreFinderListItemComponent } from '../../store-finder-list-item/store-finder-list-item.component';
import { StoreFinderStoreDescriptionComponent } from '../../store-finder-store-description/store-finder-store-description.component';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { StoreFinderPaginationDetailsComponent } from '../../store-finder-pagination-details/store-finder-pagination-details.component';

@Component({
  selector: 'cx-store-finder-list',
  templateUrl: './store-finder-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    StoreFinderPaginationDetailsComponent,
    IconComponent,
    StoreFinderStoreDescriptionComponent,
    NgFor,
    NgClass,
    StoreFinderListItemComponent,
    StoreFinderMapComponent,
    NgSwitch,
    NgSwitchCase,
    KeyValuePipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreFinderListComponent {
  @Input()
  locations: any;
  @Input()
  useMylocation: boolean;
  @ViewChild('storeMap')
  storeMap: StoreFinderMapComponent;

  selectedStore: PointOfService;
  selectedStoreIndex: number;
  isDetailsModeVisible: boolean;
  storeDetails: PointOfService;
  iconTypes = ICON_TYPE;
  displayModes = LocationDisplayMode;
  activeDisplayMode = LocationDisplayMode.LIST_VIEW;

  constructor(
    private storeFinderService: StoreFinderService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.isDetailsModeVisible = false;
  }

  centerStoreOnMapByIndex(index: number, location: PointOfService): void {
    this.showStoreDetails(location);
    this.selectedStoreIndex = index;
    this.selectedStore = location;
    this.storeMap.centerMap(
      this.storeFinderService.getStoreLatitude(this.locations.stores[index]),
      this.storeFinderService.getStoreLongitude(this.locations.stores[index])
    );
  }

  selectStoreItemList(index: number): void {
    this.selectedStoreIndex = index;
    const storeListItem = this.document.getElementById('item-' + index);
    storeListItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  showStoreDetails(location: PointOfService) {
    this.isDetailsModeVisible = true;
    this.storeDetails = location;
  }

  hideStoreDetails() {
    this.isDetailsModeVisible = false;
    this.selectedStoreIndex = undefined;
    this.selectedStore = undefined;
    this.storeMap.renderMap();
  }

  setDisplayMode(mode: LocationDisplayMode): void {
    this.activeDisplayMode = mode;
  }

  isDisplayModeActive(mode: LocationDisplayMode): boolean {
    return this.activeDisplayMode === mode;
  }
}
