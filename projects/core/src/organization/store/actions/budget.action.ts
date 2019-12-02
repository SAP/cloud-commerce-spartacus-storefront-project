import { Budget } from '../../../model/budget.model';
import {
  EntityFailAction,
  EntityLoadAction,
  EntitySuccessAction,
} from '../../../state/utils/entity-loader/entity-loader.action';
import { BudgetSearchConfig } from '../../model/search-config';
import { serializeBudgetSearchConfig } from '../../utils/budgets';
import { BUDGET_ENTITIES, BUDGET_LISTS } from '../organization-state';

export const LOAD_BUDGET = '[Budget] Load Budget Data';
export const LOAD_BUDGET_FAIL = '[Budget] Load Budget Data Fail';
export const LOAD_BUDGET_SUCCESS = '[Budget] Load Budget Data Success';

export const LOAD_BUDGETS = '[Budget] Load Budgets';
export const LOAD_BUDGETS_FAIL = '[Budget] Load Budgets Fail';
export const LOAD_BUDGETS_SUCCESS = '[Budget] Load Budgets Success';

export const CREATE_BUDGET = '[Budget] Create Budget';
export const CREATE_BUDGET_FAIL = '[Budget] Create Budget Fail';
export const CREATE_BUDGET_SUCCESS = '[Budget] Create Budget Success';

export const UPDATE_BUDGET = '[Budget] Update Budget';
export const UPDATE_BUDGET_FAIL = '[Budget] Update Budget Fail';
export const UPDATE_BUDGET_SUCCESS = '[Budget] Update Budget Success';

export class LoadBudget extends EntityLoadAction {
  readonly type = LOAD_BUDGET;
  constructor(public payload: { userId: string; budgetCode: string }) {
    super(BUDGET_ENTITIES, payload.budgetCode);
  }
}

export class LoadBudgetFail extends EntityFailAction {
  readonly type = LOAD_BUDGET_FAIL;
  constructor(budgetCode: string, public payload: any) {
    super(BUDGET_ENTITIES, budgetCode, payload);
  }
}

export class LoadBudgetSuccess extends EntitySuccessAction {
  readonly type = LOAD_BUDGET_SUCCESS;

  constructor(public payload: Budget[]) {
    super(BUDGET_ENTITIES, payload.map(budget => budget.code));
  }
}

// TODO: create standard for query params serializers

export class LoadBudgets extends EntityLoadAction {
  readonly type = LOAD_BUDGETS;
  constructor(
    public payload: {
      userId: string;
      params: BudgetSearchConfig;
    }
  ) {
    super(BUDGET_LISTS, serializeBudgetSearchConfig(payload.params));
  }
}

export class LoadBudgetsFail extends EntityFailAction {
  readonly type = LOAD_BUDGETS_FAIL;
  constructor(public payload: any) {
    super(
      BUDGET_LISTS,
      serializeBudgetSearchConfig(payload.params),
      payload.error
    );
  }
}

export class LoadBudgetsSuccess extends EntitySuccessAction {
  readonly type = LOAD_BUDGETS_SUCCESS;
  constructor(public payload: any) {
    super(BUDGET_LISTS, serializeBudgetSearchConfig(payload.params));
  }
}

export class CreateBudget extends EntityLoadAction {
  readonly type = CREATE_BUDGET;
  constructor(public payload: { userId: string; budget: Budget }) {
    super(BUDGET_ENTITIES, payload.budget.code);
  }
}

export class CreateBudgetFail extends EntityFailAction {
  readonly type = CREATE_BUDGET_FAIL;
  constructor(budgetCode: string, public payload: any) {
    super(BUDGET_ENTITIES, budgetCode, payload);
  }
}

export class CreateBudgetSuccess extends EntitySuccessAction {
  readonly type = CREATE_BUDGET_SUCCESS;
  constructor(public payload: Budget) {
    super(BUDGET_ENTITIES, payload.code, payload);
  }
}

export class UpdateBudget extends EntityLoadAction {
  readonly type = UPDATE_BUDGET;
  constructor(public payload: { userId: string; budget: Budget }) {
    super(BUDGET_ENTITIES, payload.budget.code);
  }
}

export class UpdateBudgetFail extends EntityFailAction {
  readonly type = UPDATE_BUDGET_FAIL;
  constructor(budgetCode: string, public payload: any) {
    super(BUDGET_ENTITIES, budgetCode, payload);
  }
}

export class UpdateBudgetSuccess extends EntitySuccessAction {
  readonly type = UPDATE_BUDGET_SUCCESS;
  constructor(public payload: Budget) {
    super(BUDGET_ENTITIES, payload.code, payload);
  }
}

export type BudgetAction =
  | LoadBudget
  | LoadBudgetFail
  | LoadBudgetSuccess
  | LoadBudgets
  | LoadBudgetsFail
  | LoadBudgetsSuccess
  | CreateBudget
  | CreateBudgetFail
  | CreateBudgetSuccess
  | UpdateBudget
  | UpdateBudgetFail
  | UpdateBudgetSuccess;
