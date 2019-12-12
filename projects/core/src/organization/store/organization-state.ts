import { EntityLoaderState } from '../../state/utils/entity-loader/entity-loader-state';
import { ListModel } from '../../model/misc.model';
import { Budget } from '../../model/budget.model';
import { B2BUnitNode } from '../../model/org-unit.model';

export const ORGANIZATION_FEATURE = 'organization';
export const BUDGET_FEATURE = 'budget';
export const BUDGET_ENTITIES = 'budget-entities';
export const BUDGET_LISTS = 'budget-lists';

export const ORG_UNIT_FEATURE = 'orgUnit';
export const ORG_UNIT_ENTITIES = 'orgUnit-entities';
export const ORG_UNIT_LISTS = 'orgUnit-list';

export interface BudgetManagement {
  [BUDGET_ENTITIES]?: EntityLoaderState<Budget>;
  [BUDGET_LISTS]?: EntityLoaderState<ListModel>;
}

export interface OrgUnits {
  [ORG_UNIT_ENTITIES]?: EntityLoaderState<B2BUnitNode>;
  [ORG_UNIT_LISTS]?: EntityLoaderState<ListModel>;
}

export interface StateWithOrganization {
  [ORGANIZATION_FEATURE]: OrganizationState;
}

export interface OrganizationState {
  [BUDGET_FEATURE]: BudgetManagement;
  [ORG_UNIT_FEATURE]: OrgUnits;
}
