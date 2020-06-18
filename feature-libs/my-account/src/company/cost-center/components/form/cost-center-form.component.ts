import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CostCenter } from '@spartacus/core';
import { AbstractFormComponent } from '@spartacus/storefront';
import { CostCenterFormComponentService } from './cost-center-form.component.service';

@Component({
  selector: 'cx-cost-center-form',
  templateUrl: './cost-center-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterFormComponent extends AbstractFormComponent
  implements OnInit {
  @Input()
  costCenterData: CostCenter;

  @Input()
  readonlyParent = false;

  @Input() formKey: string;

  @Output()
  pendingChanges = new EventEmitter<Boolean>(true);

  constructor(protected formService: CostCenterFormComponentService) {
    super();
  }

  ngOnInit() {
    if (this.formService.has(this.formKey)) {
      this.pendingChanges.emit(true);
    }
    this.form = this.formService.getForm(this.costCenterData, this.formKey);
  }

  protected removeForm(): void {
    this.form.reset();
    this.formService.removeForm(this.formKey);
  }
}
