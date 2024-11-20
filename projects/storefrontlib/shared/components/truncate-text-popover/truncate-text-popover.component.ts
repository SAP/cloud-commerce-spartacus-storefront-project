/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MockTranslatePipe } from '../../../../core/src/i18n/testing/mock-translate.pipe';
import { TruncatePipe } from './truncate.pipe';
import { TranslatePipe } from '../../../../core/src/i18n/translate.pipe';
import { PopoverDirective } from '../popover/popover.directive';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'cx-truncate-text-popover',
  templateUrl: './truncate-text-popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    PopoverDirective,
    TranslatePipe,
    TruncatePipe,
    MockTranslatePipe,
  ],
})
export class TruncateTextPopoverComponent {
  /**
   * String to be rendered inside popover wrapper component.
   */
  @Input() content: string;

  /**
   * The maximum length of the characters after which the text will be truncated
   */
  @Input() charactersLimit: number = 100;

  @Input() customClass?: string;

  get isTruncated(): boolean {
    return this.content.length > +this.charactersLimit;
  }
}
