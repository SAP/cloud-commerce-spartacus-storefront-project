/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerService } from './date-picker.service';
import { MockDatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { FeatureDirective } from '@spartacus/core';

/**
 * Component that adds a date control. While the native date picker works in most
 * modern browsers, some browsers need more guidance (placeholder), validation and
 * date conversion.
 *
 * The data picker supports (optional) min and max form controls, so that you can
 * limit the start and/or end date.
 *
 * Most of the implementation is done in the `DatePickerFallbackDirective`.
 */
@Component({
  selector: 'cx-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    FormErrorsComponent,
    TranslatePipe,
    CxDatePipe,

    MockDatePipe,
  ],
})
export class DatePickerComponent {
  constructor(protected service: DatePickerService) {}
  @Input() control: UntypedFormControl;
  @Input() min?: string;
  @Input() max?: string;
  @Input() required?: boolean;
  @Input() label?: string = 'Date';

  @Output() update: EventEmitter<void> = new EventEmitter();

  change() {
    this.update.emit();
  }

  get placeholder() {
    return this.service.placeholder;
  }

  get pattern() {
    return this.service.pattern;
  }

  /**
   * Only returns the date if we have a valid format. We do this to avoid
   * loads of console errors coming from the datePipe while the user is typing
   * (in those browsers where the date picker isn't supported).
   */

  getDate(date?: string): string | undefined {
    return date && this.service.isValidFormat(date) ? date : undefined;
  }
}
