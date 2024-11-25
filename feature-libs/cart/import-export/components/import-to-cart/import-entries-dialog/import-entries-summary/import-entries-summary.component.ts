/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  OrderEntriesSource,
  ProductImportSummary,
} from '@spartacus/cart/base/root';
import { ICON_TYPE } from '@spartacus/storefront';
import {
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgFor,
} from '@angular/common';
import { IconComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-import-entries-summary',
  templateUrl: './import-entries-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    IconComponent,
    NgFor,
    TranslatePipe,
  ],
})
export class ImportEntriesSummaryComponent {
  iconTypes = ICON_TYPE;
  orderEntriesSource = OrderEntriesSource;

  warningDetailsOpened: boolean = false;
  errorDetailsOpened: boolean = false;

  @Input()
  type: string;

  @Input()
  summary: ProductImportSummary;

  @Output()
  closeEvent = new EventEmitter<string>();

  close(reason: string): void {
    this.closeEvent.emit(reason);
  }

  toggleWarningList(): void {
    this.warningDetailsOpened = !this.warningDetailsOpened;
  }

  toggleErrorList(): void {
    this.errorDetailsOpened = !this.errorDetailsOpened;
  }
}
