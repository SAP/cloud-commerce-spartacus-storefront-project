import { EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { UrlCommandRoute } from '@spartacus/core';

export class AbstractFormComponent {
  form: FormGroup;

  @Input()
  actionBtnLabel: string;

  @Input()
  cancelBtnLabel: string;

  @Input()
  showCancelBtn = true;

  @Input()
  routerBackLink: UrlCommandRoute;

  @Input()
  disabledFields: string[] = [];

  @Output()
  submitForm = new EventEmitter<any>();

  @Output()
  clickBack = new EventEmitter<any>();

  submitClicked = false;

  back(): void {
    this.clickBack.emit();
  }

  verifyAndSubmit(): void {
    this.submitClicked = true;
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  isNotValid(formControlName: string): boolean {
    return this.isNotValidField(this.form, formControlName, this.submitClicked);
  }

  isNotValidField(
    form: FormGroup,
    formControlName: string,
    submitted: boolean
  ): boolean {
    const control: AbstractControl = form.get(formControlName);
    return control.invalid && (submitted || (control.touched && control.dirty));
  }
}
