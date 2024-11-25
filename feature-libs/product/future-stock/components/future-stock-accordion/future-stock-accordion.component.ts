/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { FutureStockFacade } from '@spartacus/product/future-stock/root';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-future-stock-accordion',
  templateUrl: './future-stock-accordion.component.html',
  imports: [
    NgIf,
    IconComponent,
    NgFor,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class FutureStockAccordionComponent {
  futureStocks$ = this.futureStockService.getFutureStock();
  expanded: boolean = false;
  iconType = ICON_TYPE;

  constructor(protected futureStockService: FutureStockFacade) {}

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
