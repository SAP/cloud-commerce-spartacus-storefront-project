/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoutingService } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-store-finder-search',
  templateUrl: './store-finder-search.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
    RouterLink,
    NgClass,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class StoreFinderSearchComponent {
  searchBox: UntypedFormControl = new UntypedFormControl();
  iconTypes = ICON_TYPE;

  constructor(private routingService: RoutingService) {}

  findStores(address: string) {
    this.routingService.go(['store-finder/find'], {
      queryParams: {
        query: address,
      },
    });
  }

  viewStoresWithMyLoc() {
    this.routingService.go(['store-finder/find'], {
      queryParams: {
        useMyLocation: true,
      },
    });
  }

  onKey(event: any) {
    if (
      this.searchBox.value &&
      this.searchBox.value.length &&
      event.key === 'Enter'
    ) {
      this.findStores(this.searchBox.value);
    }
  }
}
