import { Component, OnInit } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Budget, BudgetService, RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-budget-edit',
  templateUrl: './budget-edit.component.html',
})
export class BudgetEditComponent implements OnInit {
  budget$: Observable<Budget>;
  budgetCode$: Observable<string> = this.routingService
    .getRouterState()
    .pipe(map(routingData => routingData.state.params['budgetCode']));

  constructor(
    protected routingService: RoutingService,
    protected budgetsService: BudgetService
  ) {}

  ngOnInit(): void {
    this.budget$ = this.budgetCode$.pipe(
      tap(code => this.budgetsService.loadBudget(code)),
      switchMap(code => this.budgetsService.get(code))
    );
  }

  updateBudget(budget) {
    this.budgetCode$
      .pipe(take(1))
      .subscribe(budgetCode => this.budgetsService.update(budgetCode, budget));
    this.routingService.go({
      cxRoute: 'budgetDetails',
      params: budget,
    });
  }
}
