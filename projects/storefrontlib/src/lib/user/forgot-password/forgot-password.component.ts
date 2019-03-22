import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomFormValidators } from '../../ui/validators/custom-form-validators';
import { UserService, RoutingService } from '@spartacus/core';
@Component({
  selector: 'cx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  submited = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private routingService: RoutingService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userEmail: [
        '',
        [Validators.required, CustomFormValidators.emailValidator]
      ]
    });
  }

  requestForgotPasswordEmail() {
    this.submited = true;

    if (this.form.invalid) {
      return;
    }
    this.userService.requestForgotPasswordEmail(this.form.value.userEmail);
    this.routingService.go({ route: ['login'] });
  }
}
