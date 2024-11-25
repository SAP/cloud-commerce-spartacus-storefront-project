/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Country,
  GlobalMessageService,
  GlobalMessageType,
  Region,
} from '@spartacus/core';
import { Title } from '@spartacus/user/profile/root';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserRegistrationFormService } from './user-registration-form.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgSelectA11yDirective } from '../../../../../projects/storefrontlib/shared/components/ng-select-a11y/ng-select-a11y.directive';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    FeatureDirective,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    NgSelectA11yDirective,
    FormErrorsComponent,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class UserRegistrationFormComponent implements OnDestroy {
  titles$: Observable<Title[]> = this.userRegistrationFormService.getTitles();

  countries$: Observable<Country[]> =
    this.userRegistrationFormService.getCountries();

  regions$: Observable<Region[]> =
    this.userRegistrationFormService.getRegions();

  registerForm: FormGroup = this.userRegistrationFormService.form;

  isLoading$ = new BehaviorSubject(false);

  protected subscriptions = new Subscription();

  protected globalMessageService = inject(GlobalMessageService, {
    optional: true,
  });

  constructor(
    protected userRegistrationFormService: UserRegistrationFormService
  ) {}

  submit(): void {
    if (this.registerForm.valid) {
      this.isLoading$.next(true);
      this.subscriptions.add(
        this.userRegistrationFormService
          .registerUser(this.registerForm)
          .subscribe({
            complete: () => this.isLoading$.next(false),
            error: () => {
              this.isLoading$.next(false);
              this.globalMessageService?.add(
                { key: 'userRegistrationForm.messageToFailedToRegister' },
                GlobalMessageType.MSG_TYPE_ERROR
              );
            },
          })
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
