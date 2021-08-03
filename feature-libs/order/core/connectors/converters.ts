import { InjectionToken } from '@angular/core';
import { Converter, Order, ReplenishmentOrder } from '@spartacus/core';
import {
  ConsignmentTracking,
  OrderHistoryList,
  ReplenishmentOrderList,
  ReturnRequest,
  ReturnRequestEntryInputList,
  ReturnRequestList,
} from '@spartacus/order/root';

export const ORDER_NORMALIZER = new InjectionToken<Converter<any, Order>>(
  'OrderNormalizer'
);

export const ORDER_HISTORY_NORMALIZER = new InjectionToken<
  Converter<any, OrderHistoryList>
>('OrderHistoryNormalizer');

export const CONSIGNMENT_TRACKING_NORMALIZER = new InjectionToken<
  Converter<any, ConsignmentTracking>
>('ConsignmentTrackingNormalizer');

export const ORDER_RETURN_REQUEST_NORMALIZER = new InjectionToken<
  Converter<any, ReturnRequest>
>('OrderReturnRequestNormalizer');

export const ORDER_RETURN_REQUEST_INPUT_SERIALIZER = new InjectionToken<
  Converter<ReturnRequestEntryInputList, any>
>('OrderReturnRequestInputSerializer');

export const ORDER_RETURNS_NORMALIZER = new InjectionToken<
  Converter<any, ReturnRequestList>
>('OrderReturnsNormalizer');

export const REPLENISHMENT_ORDER_NORMALIZER = new InjectionToken<
  Converter<any, ReplenishmentOrder>
>('ReplenishmentOrderNormalizer');

export const REPLENISHMENT_ORDER_HISTORY_NORMALIZER = new InjectionToken<
  Converter<any, ReplenishmentOrderList>
>('ReplenishmentOrderHistoryNormalizer');
