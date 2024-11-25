/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GlobalMessageType, useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { UpdatePasswordComponentService } from './update-password-component.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { MessageComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-my-account-v2-password',
  templateUrl: './my-account-v2-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    MessageComponent,
    PasswordVisibilityToggleDirective,
    FeatureDirective,
    FormErrorsComponent,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class MyAccountV2PasswordComponent {
  protected service = inject(UpdatePasswordComponentService);
  showingAlert: boolean = true;
  globalMessageType = GlobalMessageType;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  constructor() {
    useFeatureStyles('a11yPasswordVisibliltyBtnValueOverflow');
  }

  onSubmit(): void {
    this.service.updatePassword();
  }

  onCancel(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }
  closeDialogConfirmationAlert() {
    this.showingAlert = false;
  }
}
