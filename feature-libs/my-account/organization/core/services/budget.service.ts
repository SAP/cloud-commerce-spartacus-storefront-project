import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CostCenter,
  EntitiesModel,
  SearchConfig,
  StateUtils,
  StateWithProcess,
  UserIdService,
} from '@spartacus/core';
import { Observable, queueScheduler } from 'rxjs';
import { filter, map, observeOn, tap } from 'rxjs/operators';
import { Budget } from '../model/budget.model';
import { OrganizationItemStatus } from '../model/organization-item-status';
import { BudgetActions, StateWithOrganization } from '../store/index';
import { getBudget, getBudgetList } from '../store/selectors/budget.selector';
import { getItemStatus } from '../utils/get-item-status';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  constructor(
    protected store: Store<StateWithOrganization | StateWithProcess<void>>,
    protected userIdService: UserIdService
  ) {}

  loadBudget(budgetCode: string): void {
    this.userIdService.invokeWithUserId((userId) =>
      this.store.dispatch(new BudgetActions.LoadBudget({ userId, budgetCode }))
    );
  }

  loadBudgets(params?: SearchConfig): void {
    this.userIdService.invokeWithUserId((userId) =>
      this.store.dispatch(new BudgetActions.LoadBudgets({ userId, params }))
    );
  }

  private getBudget(
    budgetCode: string
  ): Observable<StateUtils.LoaderState<Budget>> {
    return this.store.select(getBudget(budgetCode));
  }

  private getBudgetList(
    params
  ): Observable<StateUtils.LoaderState<EntitiesModel<Budget>>> {
    return this.store.select(getBudgetList(params));
  }

  get(budgetCode: string): Observable<Budget> {
    return this.getBudget(budgetCode).pipe(
      observeOn(queueScheduler),
      tap((state) => {
        if (!(state.loading || state.success || state.error)) {
          this.loadBudget(budgetCode);
        }
      }),
      filter((state) => state.success || state.error),
      map((state) => state.value)
    );
  }

  getList(params: SearchConfig): Observable<EntitiesModel<Budget>> {
    return this.getBudgetList(params).pipe(
      observeOn(queueScheduler),
      tap((process: StateUtils.LoaderState<EntitiesModel<Budget>>) => {
        if (!(process.loading || process.success || process.error)) {
          this.loadBudgets(params);
        }
      }),
      filter(
        (process: StateUtils.LoaderState<EntitiesModel<Budget>>) =>
          process.success || process.error
      ),
      map((result) => result.value)
    );
  }

  getCostCenters(budgetCode: string): Observable<EntitiesModel<CostCenter>> {
    return this.get(budgetCode).pipe(
      map((budget) => ({
        values: budget.costCenters ?? [],
      }))
    );
  }

  create(budget: Budget): void {
    this.userIdService.invokeWithUserId((userId) =>
      this.store.dispatch(new BudgetActions.CreateBudget({ userId, budget }))
    );
  }

  update(budgetCode: string, budget: Budget): void {
    this.userIdService.invokeWithUserId((userId) =>
      this.store.dispatch(
        new BudgetActions.UpdateBudget({ userId, budgetCode, budget })
      )
    );
  }

  getLoadingStatus(
    budgetCode: string
  ): Observable<OrganizationItemStatus<Budget>> {
    return getItemStatus(this.getBudget(budgetCode));
  }
}
