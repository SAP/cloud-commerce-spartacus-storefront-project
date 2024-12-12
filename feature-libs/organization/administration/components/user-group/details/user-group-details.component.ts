/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserGroup } from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { UserGroupItemService } from '../services/user-group-item.service';

@Component({
    selector: 'cx-org-user-group-details',
    templateUrl: './user-group-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ItemService,
            useExisting: UserGroupItemService,
        },
    ],
    host: { class: 'content-wrapper' },
    standalone: false
})
export class UserGroupDetailsComponent {
  model$: Observable<UserGroup> = this.itemService.key$.pipe(
    switchMap((code) => this.itemService.load(code)),
    startWith({})
  );
  isInEditMode$ = this.itemService.isInEditMode$;

  constructor(protected itemService: ItemService<UserGroup>) {}
}
