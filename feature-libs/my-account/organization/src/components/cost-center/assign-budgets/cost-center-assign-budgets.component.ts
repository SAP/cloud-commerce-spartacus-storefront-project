import { Component, OnInit } from '@angular/core';
import {
  Budget,
  CostCenterService,
  CxDatePipe,
  EntitiesModel,
  RoutingService,
} from '@spartacus/core';
import { AbstractListingComponent, ListingModel } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  selector: 'cx-cost-center-assign-budgets',
  templateUrl: './cost-center-assign-budgets.component.html',
})
export class CostCenterAssignBudgetsComponent extends AbstractListingComponent
  implements OnInit {
  cxRoute = 'costCenterAssignBudgets';
  code: string;

  constructor(
    protected routingService: RoutingService,
    protected costCenterService: CostCenterService,
    protected cxDate: CxDatePipe
  ) {
    super(routingService);
  }

  ngOnInit(): void {
    this.code$.pipe(take(1)).subscribe((code) => (this.code = code));

    this.data$ = <Observable<ListingModel>>this.queryParams$.pipe(
      withLatestFrom(this.code$),
      tap(([queryParams, code]) =>
        this.costCenterService.loadBudgets(code, queryParams)
      ),
      switchMap(([queryParams, code]) =>
        this.costCenterService.getBudgets(code, queryParams).pipe(
          filter(Boolean),
          map((budgetsList: EntitiesModel<Budget>) => ({
            sorts: budgetsList.sorts,
            pagination: budgetsList.pagination,
            values: budgetsList.values.map((budget) => ({
              selected: budget.selected,
              code: budget.code,
              name: budget.name,
              amount: `${budget.budget} ${
                budget.currency && budget.currency.symbol
              }`,
              startEndDate: `${this.cxDate.transform(
                budget.startDate
              )} - ${this.cxDate.transform(budget.endDate)}`,
              parentUnit: budget.orgUnit && budget.orgUnit.name,
              uid: budget.orgUnit && budget.orgUnit.uid,
            })),
          }))
        )
      )
    );
  }

  assign({ row }) {
    this.costCenterService.assignBudget(this.code, row.code);
  }

  unassign({ row }) {
    this.costCenterService.unassignBudget(this.code, row.code);
  }
}
