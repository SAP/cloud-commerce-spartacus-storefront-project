/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellComponent } from '../cell.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';

@Component({
  selector: 'cx-org-unit-cell',
  templateUrl: '../cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, NgTemplateOutlet, UrlPipe],
})
export class UnitCellComponent extends CellComponent {
  get property() {
    return this.model.unit?.name ?? this.model.orgUnit?.name;
  }
}
