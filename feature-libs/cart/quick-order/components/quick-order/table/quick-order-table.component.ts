/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderEntry } from '@spartacus/cart/base/root';
import { useFeatureStyles } from '@spartacus/core';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { QuickOrderItemComponent } from './item/quick-order-item.component';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'cx-quick-order-table',
  templateUrl: './quick-order-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    QuickOrderItemComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class QuickOrderTableComponent {
  @Input()
  entries: OrderEntry[] = [];

  @Input()
  loading: boolean = false;

  constructor() {
    useFeatureStyles('a11yQTY2Quantity');
  }
}
