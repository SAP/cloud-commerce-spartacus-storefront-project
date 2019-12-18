import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatePickerFormatterService {
  constructor() {}

  toNative(value) {
    return value ? new Date(value).toISOString().split('T')[0] : null;
  }

  toModel(value: string, eod: boolean): string {
    if (value) {
      let date = new Date(value)
        .toISOString()
        .replace('.', '+')
        .replace('Z', '0');
      if (eod) {
        date = date.replace('00:00:00', '00:59:59');
      }
      return date;
    }
  }
}
