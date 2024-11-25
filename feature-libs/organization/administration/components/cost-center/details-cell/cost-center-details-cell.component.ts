/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CellComponent } from '../../shared';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { PopoverDirective } from '../../../../../../projects/storefrontlib/shared/components/popover/popover.directive';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-org-cost-center-details-cell',
  templateUrl: './cost-center-details-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgIf,
    PopoverDirective,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class CostCenterDetailsCellComponent extends CellComponent {}
