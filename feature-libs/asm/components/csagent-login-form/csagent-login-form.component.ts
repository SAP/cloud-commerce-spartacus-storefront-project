/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { useFeatureStyles } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { DotSpinnerComponent } from '../dot-spinner/dot-spinner.component';
import { PasswordVisibilityToggleDirective } from '../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { FormErrorsComponent } from '../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { FeatureDirective } from '@spartacus/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'cx-csagent-login-form',
  templateUrl: './csagent-login-form.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    FormErrorsComponent,
    PasswordVisibilityToggleDirective,
    DotSpinnerComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class CSAgentLoginFormComponent implements OnInit {
  csAgentLoginForm: UntypedFormGroup;

  @Input()
  csAgentTokenLoading = false;

  @Output()
  submitEvent = new EventEmitter<{ userId: string; password: string }>();

  constructor(protected fb: UntypedFormBuilder) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
    useFeatureStyles('a11yTextSpacingAdjustments');
  }

  ngOnInit(): void {
    this.csAgentLoginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.csAgentLoginForm.valid) {
      this.submitEvent.emit({
        userId: this.csAgentLoginForm.get('userId')?.value,
        password: this.csAgentLoginForm.get('password')?.value,
      });
    } else {
      this.csAgentLoginForm.markAllAsTouched();
    }
  }
}
