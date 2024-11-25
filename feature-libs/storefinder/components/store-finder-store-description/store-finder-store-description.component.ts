/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { PointOfService, useFeatureStyles } from '@spartacus/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { AbstractStoreItemComponent } from '../abstract-store-item/abstract-store-item.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';
import { ScheduleComponent } from '../schedule-component/schedule.component';
import { StoreFinderMapComponent } from '../store-finder-map/store-finder-map.component';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-store-finder-store-description',
    templateUrl: './store-finder-store-description.component.html',
    imports: [
        NgIf,
        FeatureDirective,
        ScheduleComponent,
        NgFor,
        StoreFinderMapComponent,
        JsonPipe,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class StoreFinderStoreDescriptionComponent extends AbstractStoreItemComponent {
  @Input() location: PointOfService;
  @Input() disableMap: boolean;

  constructor(protected storeFinderService: StoreFinderService) {
    super(storeFinderService);
    useFeatureStyles('a11yStoreFinderOverflow');
  }
}
