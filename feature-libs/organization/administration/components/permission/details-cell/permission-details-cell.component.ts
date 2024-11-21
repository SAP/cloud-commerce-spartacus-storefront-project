/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CellComponent } from '../../shared';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { PopoverDirective } from '@spartacus/storefront';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-org-permission-details-cell',
  templateUrl: './permission-details-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    PopoverDirective,
    TranslatePipe,
    UrlPipe,
    TranslatePipe,
  ],
})
export class PermissionDetailsCellComponent extends CellComponent {}
