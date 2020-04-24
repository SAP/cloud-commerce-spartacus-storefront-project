import { createSelector, MemoizedSelector } from '@ngrx/store';
import { Budget } from '../../../model/budget.model';
import { EntitiesModel } from '../../../model/misc.model';
import { entityLoaderStateSelector } from '../../../state/utils/entity-loader/entity-loader.selectors';
import { EntityLoaderState } from '../../../state/utils/entity-loader/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { B2BSearchConfig } from '../../model/search-config';
import { denormalizeB2BSearch } from '../../utils/serializer';
import {
  BudgetManagement,
  BUDGET_FEATURE,
  OrganizationState,
  StateWithOrganization,
} from '../organization-state';
import { getOrganizationState } from './feature.selector';

export const getBudgetManagementState: MemoizedSelector<
  StateWithOrganization,
  BudgetManagement
> = createSelector(
  getOrganizationState,
  (state: OrganizationState) => state[BUDGET_FEATURE]
);

export const getBudgetsState: MemoizedSelector<
  StateWithOrganization,
  EntityLoaderState<Budget>
> = createSelector(
  getBudgetManagementState,
  (state: BudgetManagement) => state && state.entities
);

export const getBudget = (
  budgetCode: string
): MemoizedSelector<StateWithOrganization, LoaderState<Budget>> =>
  createSelector(getBudgetsState, (state: EntityLoaderState<Budget>) =>
    entityLoaderStateSelector(state, budgetCode)
  );

export const getBudgetList = (
  params: B2BSearchConfig
): MemoizedSelector<
  StateWithOrganization,
  LoaderState<EntitiesModel<Budget>>
> =>
  createSelector(getBudgetManagementState, (state: BudgetManagement) =>
    denormalizeB2BSearch<Budget>(state, params)
  );
