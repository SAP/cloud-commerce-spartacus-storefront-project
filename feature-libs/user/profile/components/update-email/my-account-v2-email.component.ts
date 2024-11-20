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
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { PasswordVisibilityToggleDirective } from '../../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { MessageComponent } from '../../../../../projects/storefrontlib/cms-components/misc/message/message.component';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-email',
  templateUrl: './my-account-v2-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    MockTranslatePipe,
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
