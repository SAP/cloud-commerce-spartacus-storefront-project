import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { DatePickerFormatterService } from './date-picker-formatter.service';

export const DATE_PICKER_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true,
};

export const DATE_PICKER_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true,
};

@Component({
  selector: 'cx-date-picker',
  templateUrl: './date-picker.component.html',
  providers: [DATE_PICKER_ACCESSOR, DATE_PICKER_VALIDATOR],
})
export class DatePickerComponent implements ControlValueAccessor, Validator {
  value: string;
  nativeValue: string = null;

  @ViewChild('inputElement', { static: false, read: ElementRef })
  input: ElementRef;

  @Input()
  min?: string;

  @Input()
  max?: string;

  @Input()
  eod = false;

  constructor(protected dateFormatterService: DatePickerFormatterService) {}

  onInput(event) {
    this.value = this.dateFormatterService.toModel(
      event.target.value,
      this.eod
    );
    this.nativeValue = event.target.value;
    this.onChange(this.value);
  }

  onChange(_event: any) {}

  onTouched() {}

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.nativeValue = this.dateFormatterService.toNative(value);
    }
  }

  getMin() {
    return this.dateFormatterService.toNative(this.min);
  }

  getMax() {
    return this.dateFormatterService.toNative(this.max);
  }

  validate(): { [key: string]: any } {
    if (this.input && !this.input.nativeElement.validity.valid) {
      const validity = this.input.nativeElement.validity;
      const validators: { [key: string]: boolean } = {};
      if (validity.rangeOverflow) {
        validators.rangeOverflow = true;
      }
      if (validity.rangeUnderflow) {
        validators.rangeUnderflow = true;
      }
      return validators;
    }
  }
}
