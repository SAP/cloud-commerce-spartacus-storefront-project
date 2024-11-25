/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoutingService, useFeatureStyles, WindowRef } from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import {
  VerificationToken,
  VerificationTokenCreation,
  VerificationTokenFacade,
} from '@spartacus/user/account/root';
import { ONE_TIME_PASSWORD_LOGIN_PURPOSE } from '../user-account-constants';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-otp-login-form',
  templateUrl: './otp-login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    NgTemplateOutlet,
    FormErrorsComponent,
    PasswordVisibilityToggleDirective,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
  ],
})
export class OneTimePasswordLoginFormComponent {
  protected routingService = inject(RoutingService);
  protected verificationTokenFacade = inject(VerificationTokenFacade);
  protected winRef = inject(WindowRef);

  protected busy$ = new BehaviorSubject(false);

  isUpdating$: Observable<boolean> = this.busy$.pipe(
    tap((state) => {
      const userId = this.winRef.nativeWindow?.history?.state?.['newUid'];
      if (userId) {
        this.form.patchValue({ userId });
      }
      state === true ? this.form.disable() : this.form.enable();
    })
  );

  form: UntypedFormGroup = new UntypedFormGroup({
    userId: new UntypedFormControl('', [
      Validators.required,
      CustomFormValidators.emailValidator,
    ]),
    password: new UntypedFormControl('', Validators.required),
  });

  @HostBinding('class.user-form') style = true;

  constructor() {
    useFeatureStyles('a11yPasswordVisibliltyBtnValueOverflow');
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy$.next(true);
    const verificationTokenCreation = this.collectDataFromLoginForm();
    this.verificationTokenFacade
      .createVerificationToken(verificationTokenCreation)
      .subscribe({
        next: (result: VerificationToken) =>
          this.goToVerificationTokenForm(result, verificationTokenCreation),
        error: () => this.busy$.next(false),
        complete: () => this.onCreateVerificationTokenComplete(),
      });
  }

  protected goToVerificationTokenForm(
    verificationToken: VerificationToken,
    verificationTokenCreation: VerificationTokenCreation
  ): void {
    this.routingService.go(
      {
        cxRoute: 'verifyToken',
      },
      {
        state: {
          loginId: verificationTokenCreation.loginId,
          password: verificationTokenCreation.password,
          tokenId: verificationToken.tokenId,
          expiresIn: verificationToken.expiresIn,
        },
      }
    );
  }

  protected onCreateVerificationTokenComplete(): void {
    this.form.reset();
    this.busy$.next(false);
  }

  protected collectDataFromLoginForm(): VerificationTokenCreation {
    return {
      // TODO: consider dropping toLowerCase as this should not be part of the UI,
      // as it's too opinionated and doesn't work with other AUTH services
      loginId: this.form.value.userId.toLowerCase(),
      password: this.form.value.password,
      purpose: ONE_TIME_PASSWORD_LOGIN_PURPOSE,
    };
  }
}
