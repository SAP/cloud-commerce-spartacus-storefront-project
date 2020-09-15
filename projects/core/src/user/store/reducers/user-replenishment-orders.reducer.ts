import { ReplenishmentOrderList } from '../../../model/replenishment-order.model';
import { UserActions } from '../actions/index';

export const initialState: ReplenishmentOrderList = {
  replenishmentOrders: [],
  pagination: {},
  sorts: [],
};

export function reducer(
  state = initialState,
  action: UserActions.UserReplenishmentOrdersAction
): ReplenishmentOrderList {
  switch (action.type) {
    case UserActions.LOAD_USER_REPLENISHMENT_ORDERS_SUCCESS: {
      return action.payload ? action.payload : initialState;
    }
  }
  return state;
}
