/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { StoreFinderOutlets } from '@spartacus/storefinder/root';
import { AbstractStoreItemComponent } from '../abstract-store-item/abstract-store-item.component';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OutletDirective } from '../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-store-finder-list-item',
    templateUrl: './store-finder-list-item.component.html',
    imports: [
        NgIf,
        RouterLink,
        OutletDirective,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class StoreFinderListItemComponent extends AbstractStoreItemComponent {
  @Input()
  locationIndex: number | null = null;
  @Input()
  listOrderLabel: any;
  @Input()
  displayDistance: boolean;
  @Input()
  useClickEvent: boolean;
  @Output()
  storeItemClick: EventEmitter<number> = new EventEmitter();

  readonly StoreFinderOutlets = StoreFinderOutlets;

  constructor(protected storeFinderService: StoreFinderService) {
    super(storeFinderService);
  }

  handleStoreItemClick() {
    if (this.locationIndex !== null) {
      this.storeItemClick.emit(this.locationIndex);
    }
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleStoreItemClick();
    }
  }
}
