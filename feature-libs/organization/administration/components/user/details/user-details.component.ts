/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { B2BUser, B2BUserRole, B2BUserRight } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { UserItemService } from '../services/user-item.service';
import { B2BUserService } from '@spartacus/organization/administration/core';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { ItemExistsDirective } from '../../shared/item-exists.directive';
import { DisableInfoComponent } from '../../shared/detail/disable-info/disable-info.component';
import { ToggleStatusComponent } from '../../shared/detail/toggle-status-action/toggle-status.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FocusDirective } from '../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { CardComponent } from '../../shared/card/card.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-org-user-details',
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ItemService,
      useExisting: UserItemService,
    },
  ],
  host: { class: 'content-wrapper' },
  standalone: true,
  imports: [
    NgIf,
    CardComponent,
    FocusDirective,
    RouterLink,
    ToggleStatusComponent,
    DisableInfoComponent,
    ItemExistsDirective,
    NgFor,
    RouterLinkActive,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class UserDetailsComponent {
  userGuardSubscription: Subscription;
  model$: Observable<B2BUser> = this.itemService.key$.pipe(
    switchMap((code) => this.itemService.load(code)),
    startWith({})
  );
  isInEditMode$ = this.itemService.isInEditMode$;

  isUpdatingUserAllowed = this.b2bUserService.isUpdatingUserAllowed();

  availableRoles: string[] = this.b2bUserService
    .getAllRoles()
    .map((role: B2BUserRole) => role.toString());
  availableRights: string[] = this.b2bUserService
    .getAllRights()
    .map((right: B2BUserRight) => right.toString());

  constructor(
    protected itemService: ItemService<B2BUser>,
    protected b2bUserService: B2BUserService
  ) {}

  hasRight(model: B2BUser): boolean {
    return (model.roles ?? []).some((role: string) =>
      this.availableRights.includes(role)
    );
  }
}
