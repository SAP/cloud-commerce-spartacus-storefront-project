/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Translatable } from '@spartacus/core';
import { BaseMessageComponent } from '../base-message.component';
import { MessageData } from '../message.model';
import { MessageService } from '../services/message.service';
import { ConfirmationMessageData } from './confirmation-message.model';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { NgIf } from '@angular/common';
import { FocusDirective } from '@spartacus/storefront';

/**
 * Renders a confirmation message and cancel/confirm button in the message component.
 */
@Component({
  selector: 'cx-org-confirmation',
  templateUrl: './confirmation-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FocusDirective,
    NgIf,
    IconComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class ConfirmationMessageComponent
  extends BaseMessageComponent
  implements OnInit
{
  cancelText: Translatable = {
    key: 'organization.confirmation.cancel',
  };
  confirmText: Translatable = {
    key: 'organization.confirmation.confirm',
  };

  constructor(
    protected data: MessageData<ConfirmationMessageData>,
    @Inject(PLATFORM_ID) protected platformId: any,
    protected messageService: MessageService
  ) {
    super(data, platformId);
  }

  ngOnInit() {
    super.ngOnInit();
    this.cancelText = this.messageData.cancel ?? this.cancelText;
    this.confirmText = this.messageData.confirm ?? this.confirmText;
  }
  /**
   * Emits a confirmation event to the data events.
   *
   * The original author of the event message or other parties can observe
   * the event data.
   */
  confirm() {
    this.data.events?.next({ confirm: true });
  }
}
