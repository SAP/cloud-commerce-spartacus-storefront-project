import { createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromFeature from '../reducers/index';
import * as fromUserOrdersReducer from '../reducers/user-orders.reducer';
import { OrderHistoryList } from '../../../occ/occ-models/index';
import { UserOrdersState, UserState } from '../user-state';

export const getOrdersState: MemoizedSelector<
  any,
  UserOrdersState
> = createSelector(
  fromFeature.getUserState,
  (state: UserState) => state.orders
);

export const getOrders: MemoizedSelector<
  any,
  OrderHistoryList
> = createSelector(
  getOrdersState,
  fromUserOrdersReducer.getOrders
);

export const getOrdersLoaded: MemoizedSelector<any, boolean> = createSelector(
  getOrdersState,
  fromUserOrdersReducer.getOrdersLoaded
);
