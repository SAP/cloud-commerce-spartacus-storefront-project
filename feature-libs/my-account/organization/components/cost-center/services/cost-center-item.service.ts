import { Injectable } from '@angular/core';
import { CostCenter, RoutingService } from '@spartacus/core';
import { CostCenterService } from '@spartacus/my-account/organization/core';
import { Observable } from 'rxjs';
import { OrganizationItemService } from '../../shared/organization-item.service';
import { CostCenterFormService } from '../form/cost-center-form.service';
import { CurrentCostCenterService } from './current-cost-center.service';
import { ItemInfo } from '../../../core/model/LoadStatus';

@Injectable({
  providedIn: 'root',
})
export class CostCenterItemService extends OrganizationItemService<CostCenter> {
  constructor(
    protected currentItemService: CurrentCostCenterService,
    protected routingService: RoutingService,
    protected formService: CostCenterFormService,
    protected costCenterService: CostCenterService
  ) {
    super(currentItemService, routingService, formService);
  }

  load(code: string): Observable<CostCenter> {
    this.costCenterService.load(code);
    return this.costCenterService.get(code);
  }

  update(code, value: CostCenter): Observable<ItemInfo<CostCenter>> {
    this.costCenterService.update(code, value);
    return this.costCenterService.getLoadingStatus(code);
  }

  protected create(value: CostCenter) {
    this.costCenterService.create(value);
  }

  protected getDetailsRoute(): string {
    return 'costCenterDetails';
  }
}
