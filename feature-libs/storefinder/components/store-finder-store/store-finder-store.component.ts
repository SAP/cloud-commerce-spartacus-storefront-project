/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnInit } from '@angular/core';
import { PointOfService, RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ICON_TYPE } from '@spartacus/storefront';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';
import { IconComponent } from '../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { StoreFinderStoreDescriptionComponent } from '../store-finder-store-description/store-finder-store-description.component';
import { SpinnerComponent } from '../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-store-finder-store',
    templateUrl: './store-finder-store.component.html',
    imports: [
        NgIf,
        FeatureDirective,
        IconComponent,
        StoreFinderStoreDescriptionComponent,
        SpinnerComponent,
        AsyncPipe,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class StoreFinderStoreComponent implements OnInit {
  location$: Observable<any>;
  isLoading$: Observable<any>;
  iconTypes = ICON_TYPE;

  @Input() location: PointOfService;
  @Input() disableMap: boolean;

  constructor(
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit() {
    if (!this.location) {
      this.requestStoresData();
      this.location$ = this.storeFinderService.getFindStoreEntityById();
      this.isLoading$ = this.storeFinderService.getStoresLoading();
    }
  }

  requestStoresData() {
    this.storeFinderService.viewStoreById(this.route.snapshot.params.store);
  }

  goBack(): void {
    this.routingService.go([
      `store-finder/country/${this.route.snapshot.params.country}`,
    ]);
  }
}
