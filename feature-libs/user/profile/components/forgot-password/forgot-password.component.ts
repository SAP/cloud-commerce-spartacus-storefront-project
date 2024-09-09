/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ForgotPasswordComponentService } from './forgot-password-component.service';
import { RoutingService, FeaturesConfigModule, UrlModule, I18nModule } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { SpinnerModule, FormErrorsModule } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'cx-forgot-password',
    templateUrl: './forgot-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        SpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        FeaturesConfigModule,
        FormErrorsModule,
        RouterLink,
        AsyncPipe,
        UrlModule,
        I18nModule,
    ],
})
export class ForgotPasswordComponent {
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected service: ForgotPasswordComponentService) {}

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  onSubmit(): void {
    this.service.requestEmail();
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
