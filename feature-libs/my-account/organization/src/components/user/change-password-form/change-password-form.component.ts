import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '@spartacus/core';

@Component({
  selector: 'cx-change-password-form',
  templateUrl: './change-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent {
  /**
   * The form is controlled from the container component.
   */
  @Input() form: FormGroup;

  constructor(protected userService: UserService) {}
}
