import { Injectable } from '@angular/core';
import { B2BUser, EntitiesModel } from '@spartacus/core';
import { OrgUnitService } from '@spartacus/my-account/organization/core';
import { TableService, TableStructure } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { OrganizationSubListService } from '../../../shared/organization-sub-list/organization-sub-list.service';
import { OrganizationTableType } from '../../../shared/organization.model';

@Injectable({
  providedIn: 'root',
})
export class UnitCostCenterListService extends OrganizationSubListService<
  B2BUser
> {
  protected tableType = OrganizationTableType.UNIT_COST_CENTERS;
  protected domainType = OrganizationTableType.COST_CENTER;

  constructor(
    protected tableService: TableService,
    protected unitService: OrgUnitService
  ) {
    super(tableService);
  }

  protected load(
    _structure: TableStructure,
    code: string
  ): Observable<EntitiesModel<B2BUser>> {
    return this.unitService.getCostCenters(code);
  }
}
