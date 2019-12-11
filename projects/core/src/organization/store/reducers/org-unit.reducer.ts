import { B2BUnitNode } from '../../../model/org-unit.model';
import { LoaderAction } from '../../../state/utils/loader/loader.action';
import * as OrgUnitActions from '../actions/org-unit.action';

export const orgUnitInitialState = undefined;

export function orgUnitEntitiesReducer(
  state = orgUnitInitialState,
  action: LoaderAction
): B2BUnitNode {
  switch (action.type) {
  }
  return state;
}

export function orgUnitListReducer(
  state = orgUnitInitialState,
  action: LoaderAction
): any {
  switch (action.type) {
    case OrgUnitActions.LOAD_ORG_UNITS_SUCCESS:
      return action.payload.orgUnitPage;
  }
  return state;
}
