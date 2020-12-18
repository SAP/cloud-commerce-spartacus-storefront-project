import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UpdateEmailService } from './update-email.service';

@Component({
  selector: 'cx-update-email',
  templateUrl: './update-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmailComponent implements OnDestroy {
  constructor(protected service: UpdateEmailService) {}

  form: FormGroup = this.service.form;
  isUpdating$ = this.service.isUpdating$;
  onSubmit = () => this.service.save();

  ngOnDestroy() {
    // Form has to be reset in order to have a clean form
    // next time component is called
    this.service.reset();
  }
}
