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
import { User } from '@spartacus/user/account/root';
import { Title } from '@spartacus/user/profile/root';
import { Observable } from 'rxjs';
import { UpdateProfileComponentService } from './update-profile-component.service';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { FeatureDirective } from '@spartacus/core';
import { NgSelectA11yDirective } from '../../../../../projects/storefrontlib/shared/components/ng-select-a11y/ng-select-a11y.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-profile',
  templateUrl: './my-account-v2-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgSelectA11yDirective,
    NgFor,
    FeatureDirective,
    FormErrorsComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class MyAccountV2ProfileComponent implements OnInit {
  protected service = inject(UpdateProfileComponentService);
  ngOnInit(): void {
    this.isEditing = false;
  }

  form: UntypedFormGroup = this.service.form;
  isUpdating$ = this.service.isUpdating$;
  titles$: Observable<Title[]> = this.service.titles$;
  user$: Observable<User> = this.service.user$;
  isEditing: boolean;
  originalEditValue: User;

  onSubmit(): void {
    this.service.updateProfile();
    this.service.updateSucceed$.subscribe((res) => {
      this.isEditing = !res;
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.form.setValue(this.originalEditValue);
  }

  onEdit(): void {
    this.isEditing = true;
    this.originalEditValue = this.form.value;
  }
}
