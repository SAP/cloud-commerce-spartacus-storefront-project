import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CostCenterService, RoutingService } from '@spartacus/core';
import { map } from 'rxjs/operators';
import { CostCenterFormService } from '../form/cost-center-form.service';
import { Observable } from 'rxjs';
import {CurrentCostCenterService} from "../current-cost-center.service";

@Component({
  selector: 'cx-cost-center-create',
  templateUrl: './cost-center-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrentCostCenterService]
})
export class CostCenterCreateComponent {
  // It would be nice to replace this query param approach with a session service that
  // provides a generic approach for session-interests, so that we can autofill forms, without
  // changing the URL. This can keep the current language, currency, parent unit, cost center, budget, etc.
  parentUnit$ = this.currentCostCenterService.parentUnit$;

  form$: Observable<FormGroup> = this.parentUnit$.pipe(
    map((parentUnit: string) =>
      this.costCenterFormService.getForm({ unit: { uid: parentUnit } })
    )
  );

  constructor(
    protected costCenterService: CostCenterService,
    protected costCenterFormService: CostCenterFormService,
    protected routingService: RoutingService,
    protected currentCostCenterService: CurrentCostCenterService
  ) {}

  save(form: FormGroup): void {
    if (form.invalid) {
      form.markAllAsTouched();
    } else {
      form.disable();
      this.costCenterService.create(form.value);

      this.routingService.go({
        cxRoute: 'costCenterDetails',
        params: form.value,
      });
    }
  }
}
