/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { useFeatureStyles, User } from '@spartacus/core';
import { LoadStatus } from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap, take } from 'rxjs/operators';
import { MessageService } from '../../shared/message/services/message.service';
import { UserItemService } from '../services/user-item.service';
import { UserChangePasswordFormService } from './user-change-password-form.service';
import { TranslatePipe } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { FocusDirective } from '@spartacus/storefront';
import { CardComponent } from '../../shared/card/card.component';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-org-user-change-password-form',
  templateUrl: './user-change-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    CardComponent,
    FocusDirective,
    RouterLink,
    NgTemplateOutlet,
    PasswordVisibilityToggleDirective,
    FormErrorsComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class UserChangePasswordFormComponent {
  form$: Observable<UntypedFormGroup | null> = this.itemService.current$.pipe(
    map((item) => this.formService.getForm(item))
  );

  constructor(
    protected itemService: UserItemService,
    protected formService: UserChangePasswordFormService,
    protected messageService: MessageService
  ) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  save(form: UntypedFormGroup): void {
    this.itemService.current$
      .pipe(
        first(),
        switchMap((item) =>
          this.itemService.save(form, (form.value as User).customerId).pipe(
            take(1),
            filter((data) => data.status === LoadStatus.SUCCESS),
            map((data) => ({
              ...item,
              ...data.item,
            }))
          )
        )
      )
      .subscribe((data) => {
        this.notify(data);
        this.itemService.launchDetails(data);
      });
  }

  protected notify(item: User) {
    this.messageService.add({
      message: {
        key: `orgUser.messages.updatePassword`,
        params: {
          item,
        },
      },
    });
  }
}
