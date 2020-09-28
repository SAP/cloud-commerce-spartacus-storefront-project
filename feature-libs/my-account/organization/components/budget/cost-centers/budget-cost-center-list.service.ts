import { Injectable } from '@angular/core';
import { CostCenter, EntitiesModel } from '@spartacus/core';
import { Budget, BudgetService } from '@spartacus/my-account/organization/core';
import { TableService, TableStructure } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationSubListService } from '../../shared/organization-sub-list/organization-sub-list.service';
import { OrganizationTableType } from '../../shared/organization.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetCostCenterListService extends OrganizationSubListService<
  Budget
> {
  protected tableType = OrganizationTableType.BUDGET_ASSIGNED_COST_CENTERS;
  protected domainType = OrganizationTableType.COST_CENTER;

  constructor(
    protected tableService: TableService,
    protected budgetService: BudgetService
  ) {
    super(tableService);
  }

  protected load(
    _structure: TableStructure,
    code: string
  ): Observable<EntitiesModel<CostCenter>> {
    return this.budgetService
      .getCostCenters(code)
      .pipe(map((costCenter) => this.filterSelected(costCenter)));
  }

  /**
   * As we can't filter with the backend API, we do this client side.
   */
  protected filterSelected({
    pagination,
    sorts,
    values,
  }: EntitiesModel<CostCenter>): EntitiesModel<CostCenter> {
    return {
      pagination,
      sorts,
      values: values.filter((value) => value.active),
    };
  }
}
