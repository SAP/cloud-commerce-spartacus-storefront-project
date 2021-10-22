import {
  DeliveryOrderEntryGroup,
  OrderEntry,
  PickupOrderEntryGroup,
  PromotionResult,
  Voucher,
} from '@spartacus/cart/main/root';
import {
  Address,
  B2BUser,
  CostCenter,
  PaginationModel,
  PaymentDetails,
  PointOfService,
  Price,
  Principal,
  SortModel,
} from '@spartacus/core';

export interface DeliveryMode {
  code?: string;
  deliveryCost?: Price;
  description?: string;
  name?: string;
}

export interface CancelOrReturnRequestEntryInput {
  orderEntryNumber?: number;
  quantity?: number;
}

export interface ReturnRequestEntryInputList {
  orderCode?: string;
  returnRequestEntryInputs?: CancelOrReturnRequestEntryInput[];
}

export interface CancellationRequestEntryInputList {
  cancellationRequestEntryInputs?: CancelOrReturnRequestEntryInput[];
}

export interface ReturnRequestEntry {
  orderEntry?: OrderEntry;
  expectedQuantity?: number;
  refundAmount?: Price;
}

export interface ReturnRequest {
  cancellable?: boolean;
  code?: string;
  creationTime?: Date;
  deliveryCost?: Price;
  order?: Order;
  refundDeliveryCost?: boolean;
  returnEntries?: ReturnRequestEntry[];
  returnLabelDownloadUrl?: string;
  rma?: string;
  status?: string;
  subTotal?: Price;
  totalPrice?: Price;
}

export interface ReturnRequestList {
  returnRequests?: ReturnRequest[];
  pagination?: PaginationModel;
  sorts?: SortModel[];
}

export interface ReturnRequestModification {
  status?: string;
}

export interface PromotionOrderEntryConsumed {
  adjustedUnitPrice?: number;
  code?: string;
  orderEntryNumber?: number;
  quantity?: number;
}

export interface ConsignmentEntry {
  orderEntry?: OrderEntry;
  quantity?: number;
  shippedQuantity?: number;
}

export interface Consignment {
  code?: string;
  deliveryPointOfService?: PointOfService;
  entries?: ConsignmentEntry[];
  shippingAddress?: Address;
  status?: string;
  statusDate?: Date;
  trackingID?: string;
}

export interface OrderHistory {
  code?: string;
  guid?: string;
  placed?: Date;
  status?: string;
  statusDisplay?: string;
  total?: Price;
}

export interface OrderHistoryList {
  orders?: OrderHistory[];
  pagination?: PaginationModel;
  sorts?: SortModel[];
}

export interface Order {
  appliedOrderPromotions?: PromotionResult[];
  appliedProductPromotions?: PromotionResult[];
  appliedVouchers?: Voucher[];
  calculated?: boolean;
  code?: string;
  consignments?: Consignment[];
  costCenter?: CostCenter;
  created?: Date;
  deliveryAddress?: Address;
  deliveryCost?: Price;
  deliveryItemsQuantity?: number;
  deliveryMode?: DeliveryMode;
  deliveryOrderGroups?: DeliveryOrderEntryGroup[];
  deliveryStatus?: string;
  deliveryStatusDisplay?: string;
  entries?: OrderEntry[];
  guestCustomer?: boolean;
  guid?: string;
  net?: boolean;
  orderDiscounts?: Price;
  orgCustomer?: B2BUser;
  paymentInfo?: PaymentDetails;
  pickupItemsQuantity?: number;
  pickupOrderGroups?: PickupOrderEntryGroup[];
  productDiscounts?: Price;
  purchaseOrderNumber?: string;
  site?: string;
  status?: string;
  statusDisplay?: string;
  store?: string;
  subTotal?: Price;
  totalDiscounts?: Price;
  totalItems?: number;
  totalPrice?: Price;
  totalPriceWithTax?: Price;
  totalTax?: Price;
  unconsignedEntries?: OrderEntry[];
  user?: Principal;
  returnable?: boolean;
  cancellable?: boolean;
}
