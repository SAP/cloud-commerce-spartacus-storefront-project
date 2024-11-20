/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellComponent } from '../cell.component';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'cx-org-amount-cell',
  templateUrl: '../cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, NgTemplateOutlet, UrlPipe],
})
export class AmountCellComponent extends CellComponent {
  get property(): string | undefined {
    if (this.budget && this.currency) {
      return this.budget + ' ' + this.currency;
    }
    return undefined;
  }

  protected get budget() {
    return this.model.budget;
  }

  protected get currency() {
    return this.model.currency?.isocode || this.model.currency;
  }
}
