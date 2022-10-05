import { Injectable } from '@angular/core';
import {
  OrganizationTableType,
  UnitItemService,
  UnitListService,
  UnitTreeService,
} from '@spartacus/organization/administration/components';
import { OrgUnitService } from '@spartacus/organization/administration/core';
import { TableService } from '@spartacus/storefront';
@Injectable({
  providedIn: 'root',
})
export class AccountSummaryUnitListService extends UnitListService {
  protected tableType = OrganizationTableType.ACCOUNT_SUMMARY_UNIT as any;

  constructor(
    protected tableService: TableService,
    protected unitService: OrgUnitService,
    protected unitItemService: UnitItemService,
    protected unitTreeService: UnitTreeService
  ) {
    super(tableService, unitService, unitItemService, unitTreeService);
  }
}
