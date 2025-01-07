/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';

import { VerificationToken, VerificationTokenFacade } from '@spartacus/user/account/root';
import { ONE_TIME_PASSWORD_REGISTRATION_PURPOSE } from '../user-account-constants';
import { RegisterVerificationTokenFormComponentService } from './register-verification-token-form-component.service';
import { GlobalMessageService, RoutingService } from '@spartacus/core';
import { UntypedFormGroup } from '@angular/forms';
import {  Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cx-verification-token-form',
  templateUrl: './register-verification-token-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterVerificationTokenFormComponent implements OnInit {
  constructor() {}
  protected service: RegisterVerificationTokenFormComponentService = inject(
    RegisterVerificationTokenFormComponentService
  );
  protected launchDialogService: LaunchDialogService =
    inject(LaunchDialogService);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected routingService: RoutingService = inject(RoutingService);
  protected verificationTokenFacade = inject(VerificationTokenFacade);
  form: UntypedFormGroup = this.service.form;
  isUpdating$: Subject<boolean> = new Subject<boolean>();
  protected globalMessage: GlobalMessageService = inject(GlobalMessageService);
  isVerificationCodeValid: boolean = false;
  // isUpdating$ = this.busy$.pipe(
  //   tap((state) => {
  //     state === true ? this.form.disable() : this.form.enable();
  //   })
  // );
  waitTime: number = 60;
  protected subscriptions = new Subscription();

  @HostBinding('class.user-form') style = true;

  @ViewChild('noReceiveCodeLink') element: ElementRef;

  @ViewChild('resendLink') resendLink: ElementRef;

  tokenId: string;

  tokenCode: string;

  registerForm: UntypedFormGroup = this.service.form;

  target: string;

  password: string;

  isResendDisabled: boolean = true;

  ngOnInit() {
    if (!!history.state) {
      this.registerForm = history.state['form'];
      this.tokenId = history.state['tokenId'];
      this.target = history.state['loginId'];
      history.pushState(
        {
          tokenId: '',
          loginId: '',
        },
        'verifyToken'
      );
      if (!this.target || !this.tokenId) {
        this.service.displayMessage(
          'verificationTokenForm.needInputCredentials',
          {}
        );
        this.routingService.go(['/login']);
      } else {
        this.startWaitTimeInterval();
        this.service.displayMessage(
          'verificationTokenForm.createVerificationToken',
          { target: this.target }
        );
      }
    }
  }

  onSubmit(): void {
    // this.service.registerUser(this.registerForm);
    // submit(): void {
      // if (this.registerForm.valid) {
        this.isUpdating$.next(true);
        this.subscriptions.add(
          this.service
            .registerUser(this.registerForm)
            .subscribe({
              complete: () => this.isUpdating$.next(false),
              error: () => {
                this.isUpdating$.next(false);
                this.isVerificationCodeValid = false;
                // this.registerForm.get('tokenCode').setValue('');
                // this.tokenCode = '';
                // this.globalMessage?.add(
                //   { key: 'userRegistrationForm.messageToFailedToRegister' },
                //   GlobalMessageType.MSG_TYPE_ERROR
                // );
              },
            })
        );
      // } else {
        // this.registerForm.markAllAsTouched();
      // }
    // }
  }

  resendOTP(): void {
    this.isResendDisabled = true;
    this.resendLink.nativeElement.tabIndex = -1;
    this.resendLink.nativeElement.blur();
    this.waitTime = 60;
    this.startWaitTimeInterval();
    this.verificationTokenFacade.createVerificationToken({
      loginId: this.target,
      purpose: ONE_TIME_PASSWORD_REGISTRATION_PURPOSE})
      .subscribe({
        next: (result: VerificationToken) => (this.tokenId = result.tokenId),
        complete: () =>
          this.service.displayMessage(
            'verificationTokenForm.createVerificationToken',
            { target: this.target }
          ),
      });
  }


  startWaitTimeInterval(): void {
    const interval = setInterval(() => {
      this.waitTime--;
      this.cdr.detectChanges();
      if (this.waitTime <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false;
        this.resendLink.nativeElement.tabIndex = 0;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  openInfoDailog(): void {
    this.launchDialogService.openDialogAndSubscribe(
      LAUNCH_CALLER.ACCOUNT_VERIFICATION_TOKEN,
      this.element
    );
  }

  onOpenInfoDailogKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openInfoDailog();
    }
  }
}
