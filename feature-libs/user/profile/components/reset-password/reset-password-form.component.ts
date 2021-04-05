import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ErrorModel,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  HttpErrorModel,
} from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { UserPasswordFacade } from '@spartacus/user/profile/root';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-reset-password-form',
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent implements OnInit, OnDestroy {
  token: string;
  subscription = new Subscription();

  resetPasswordForm: FormGroup = this.fb.group(
    {
      password: [
        '',
        [Validators.required, CustomFormValidators.passwordValidator],
      ],
      repassword: ['', [Validators.required]],
    },
    {
      validators: CustomFormValidators.passwordsMustMatch(
        'password',
        'repassword'
      ),
    }
  );

  constructor(
    protected fb: FormBuilder,
    protected routingService: RoutingService,
    protected userPassword: UserPasswordFacade,
    protected globalMessage: GlobalMessageService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.routingService
        .getRouterState()
        .subscribe((state) => (this.token = state.state.queryParams['token']))
    );
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const password = this.resetPasswordForm.get('password')!.value;
      this.userPassword.reset(this.token, password).subscribe({
        next: () => {
          this.globalMessage.add(
            { key: 'forgottenPassword.passwordResetSuccess' },
            GlobalMessageType.MSG_TYPE_CONFIRMATION
          );
          this.routingService.go({ cxRoute: 'login' });
        },
        error: (error: HttpErrorModel) => {
          if (error.details) {
            error.details.forEach((err: ErrorModel) => {
              if (err.message) {
                this.globalMessage.add(
                  { raw: err.message },
                  GlobalMessageType.MSG_TYPE_ERROR
                );
              }
            });
          }
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
