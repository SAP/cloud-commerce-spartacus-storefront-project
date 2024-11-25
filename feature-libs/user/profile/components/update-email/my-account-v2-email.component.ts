/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GlobalMessageType, User } from '@spartacus/core';
import { Observable } from 'rxjs';

import { UserProfileFacade } from '@spartacus/user/profile/root';
import { filter } from 'rxjs/operators';
import { UpdateEmailComponentService } from './update-email-component.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { MessageComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-my-account-v2-email',
  templateUrl: './my-account-v2-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    SpinnerComponent,
    MessageComponent,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    FormErrorsComponent,
    PasswordVisibilityToggleDirective,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class MyAccountV2EmailComponent implements OnInit {
  protected emailComponentService = inject(UpdateEmailComponentService);
  protected userProfile = inject(UserProfileFacade);
  form: UntypedFormGroup = this.emailComponentService.form;
  isUpdating$: Observable<boolean> = this.emailComponentService.isUpdating$;
  isEditing: boolean;
  showingAlert: boolean;

  user$ = this.userProfile
    .get()
    .pipe(filter((user): user is User => Boolean(user)));
  globalMessageType = GlobalMessageType;

  ngOnInit(): void {
    this.isEditing = false;
  }
  onSubmit(): void {
    this.emailComponentService.save();
    this.emailComponentService.updateSucceed$.subscribe((res) => {
      this.isEditing = !res;
    });
  }

  onEdit(): void {
    this.isEditing = true;
    this.showingAlert = true;
    this.form.reset();
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  closeDialogConfirmationAlert() {
    this.showingAlert = false;
  }
}
