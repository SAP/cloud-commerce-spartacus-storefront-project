import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import {
  Order,
  OrderHistoryList,
  ReplenishmentOrder,
  ReplenishmentOrderList,
  ReturnRequest,
  ReturnRequestList,
} from '@spartacus/cart/order/root';
import { StateUtils } from '@spartacus/core';
import {
  OrderState,
  USER_ORDERS,
  USER_ORDER_DETAILS,
  USER_REPLENISHMENT_ORDERS,
  USER_REPLENISHMENT_ORDER_DETAILS,
  USER_RETURN_REQUESTS,
  USER_RETURN_REQUEST_DETAILS,
} from '../order-state';
import * as fromConsignmentTrackingReducer from './consignment-tracking.reducer';
import * as fromOrderDetailsReducer from './order-details.reducer';
import * as fromOrderReturnRequestReducer from './order-return-request.reducer';
import * as fromUserOrdersReducer from './orders.reducer';
import * as fromReplenishmentOrderDetailsReducer from './replenishment-order-details.reducer';
import * as fromUserReplenishmentOrdersReducer from './replenishment-orders.reducer';

export function getReducers(): ActionReducerMap<Partial<OrderState>> {
  return {
    orders: StateUtils.loaderReducer<OrderHistoryList>(
      USER_ORDERS,
      fromUserOrdersReducer.reducer
    ),
    orderDetail: StateUtils.loaderReducer<Order>(
      USER_ORDER_DETAILS,
      fromOrderDetailsReducer.reducer
    ),
    replenishmentOrders: StateUtils.loaderReducer<ReplenishmentOrderList>(
      USER_REPLENISHMENT_ORDERS,
      fromUserReplenishmentOrdersReducer.reducer
    ),
    orderReturn: StateUtils.loaderReducer<ReturnRequest>(
      USER_RETURN_REQUEST_DETAILS
    ),
    orderReturnList: StateUtils.loaderReducer<ReturnRequestList>(
      USER_RETURN_REQUESTS,
      fromOrderReturnRequestReducer.reducer
    ),
    consignmentTracking: fromConsignmentTrackingReducer.reducer,
    replenishmentOrder: StateUtils.loaderReducer<ReplenishmentOrder>(
      USER_REPLENISHMENT_ORDER_DETAILS,
      fromReplenishmentOrderDetailsReducer.reducer
    ),
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<OrderState>
> = new InjectionToken<ActionReducerMap<OrderState>>('OrderReducers');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
