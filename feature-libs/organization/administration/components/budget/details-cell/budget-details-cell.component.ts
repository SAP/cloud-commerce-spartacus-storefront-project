/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CellComponent } from '../../shared';
import { RouterLink } from '@angular/router';
import { PopoverDirective } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';

@Component({
  selector: 'cx-org-budget-details-cell',
  templateUrl: './budget-details-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PopoverDirective,
    TranslatePipe,
    CxDatePipe,
    UrlPipe,

    CxDatePipe,
  ],
})
export class BudgetDetailsCellComponent extends CellComponent {}
