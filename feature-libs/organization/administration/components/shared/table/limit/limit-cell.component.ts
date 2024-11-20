/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Permission } from '@spartacus/organization/administration/core';
import { CellComponent } from '../cell.component';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'cx-org-limit-cell',
  templateUrl: './limit-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class LimitCellComponent extends CellComponent {
  get isTimeSpanThreshold(): boolean {
    return (
      (this.model as Permission).orderApprovalPermissionType?.code ===
      'B2BOrderThresholdTimespanPermission'
    );
  }

  get isOrderThreshold(): boolean {
    return (
      (this.model as Permission).orderApprovalPermissionType?.code ===
      'B2BOrderThresholdPermission'
    );
  }

  get isExceedPermission(): boolean {
    return (
      (this.model as Permission).orderApprovalPermissionType?.code ===
      'B2BBudgetExceededPermission'
    );
  }
}
