/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../../shared/list/list.service';
import { UserGroupAssignedUserListService } from './user-group-assigned-user-list.service';
import { SubListComponent } from '../../../shared/sub-list/sub-list.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-org-user-group-assigned-user-list',
  templateUrl: './user-group-assigned-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserGroupAssignedUserListService,
    },
  ],
  imports: [SubListComponent, RouterLink, TranslatePipe, TranslatePipe],
})
export class UserGroupAssignedUserListComponent {}
