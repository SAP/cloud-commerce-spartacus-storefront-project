/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  STATUS,
  STATUS_NAME,
  TicketEvent,
} from '@spartacus/customer-ticketing/root';
import { FormUtils } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { CustomerTicketingDialogComponent } from '../../../shared/customer-ticketing-dialog/customer-ticketing-dialog.component';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { SpinnerComponent } from '../../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { FileUploadComponent } from '../../../../../../projects/storefrontlib/shared/components/form/file-upload/file-upload.component';
import { FormErrorsComponent } from '../../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { IconComponent } from '../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusDirective } from '../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-customer-ticketing-reopen-dialog',
  templateUrl: './customer-ticketing-reopen-dialog.component.html',
  standalone: true,
  imports: [
    FocusDirective,
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
    FormErrorsComponent,
    FileUploadComponent,
    NgIf,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class CustomerTicketingReopenDialogComponent
  extends CustomerTicketingDialogComponent
  implements OnInit, OnDestroy
{
  subscription: Subscription;

  ngOnInit(): void {
    this.buildForm();
  }

  reopenRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      FormUtils.deepUpdateValueAndValidity(this.form);
    } else {
      const mustWaitForAttachment =
        this.form.get('file')?.value?.length > 0 ?? false;
      this.isDataLoading$.next(true);
      this.subscription = this.customerTicketingFacade
        .createTicketEvent(this.prepareTicketEvent(), mustWaitForAttachment)
        .subscribe({
          next: (createdEvent: TicketEvent) => {
            if (this.form.get('file')?.value?.length && createdEvent.code) {
              this.customerTicketingFacade.uploadAttachment(
                this.form.get('file')?.value?.item(0),
                createdEvent.code
              );
            }
          },
          complete: () => {
            this.onComplete();
          },
          error: () => {
            this.onError();
          },
        });
    }
  }

  protected onComplete(): void {
    this.isDataLoading$.next(false);
    this.close('Ticket reopened successfully');
  }

  protected onError(): void {
    this.isDataLoading$.next(false);
    this.close('Something went wrong while reopening ticket');
  }

  protected prepareTicketEvent(): TicketEvent {
    return {
      message: this.form?.get('message')?.value,
      toStatus: {
        id: STATUS.INPROCESS,
        name: STATUS_NAME.INPROCESS,
      },
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
