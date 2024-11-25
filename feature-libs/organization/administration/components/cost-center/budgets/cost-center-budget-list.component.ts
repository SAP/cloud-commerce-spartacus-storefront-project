/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../shared/list/list.service';
import { CostCenterBudgetListService } from './cost-center-budget-list.service';
import { SubListComponent } from '../../shared/sub-list/sub-list.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-org-cost-center-budget-list',
  templateUrl: './cost-center-budget-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: CostCenterBudgetListService,
    },
  ],
  imports: [SubListComponent, RouterLink, TranslatePipe, MockTranslatePipe],
})
export class CostCenterBudgetListComponent {}
