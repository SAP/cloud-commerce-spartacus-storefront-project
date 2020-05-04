import { Component } from '@angular/core';
import { CostCenterService, RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cx-cost-center-create',
  templateUrl: './cost-center-create.component.html',
})
export class CostCenterCreateComponent {
  parentUnit$: Observable<string> = this.routingService
    .getRouterState()
    .pipe(map((routingData) => routingData.state.queryParams?.['parentUnit']));

  constructor(
    protected costCenterService: CostCenterService,
    protected routingService: RoutingService
  ) {}

  createCostCenter(costCenter) {
    this.costCenterService.create(costCenter);
    this.routingService.go({
      cxRoute: 'costCenterDetails',
      params: costCenter,
    });
  }
}
