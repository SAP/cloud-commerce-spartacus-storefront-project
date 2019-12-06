import {
  ReturnRequest,
  ReturnRequestEntryInputList,
  ReturnRequestList,
} from '../../../model/order.model';
import {
  USER_RETURN_REQUESTS,
  USER_RETURN_REQUEST_DETAILS,
} from '../user-state';
import {
  LoaderFailAction,
  LoaderLoadAction,
  LoaderSuccessAction,
  LoaderResetAction,
} from '../../../state/utils/loader/loader.action';

export const CREATE_ORDER_RETURN_REQUEST = '[User] Create Order Return Request';
export const CREATE_ORDER_RETURN_REQUEST_FAIL =
  '[User] Create Order Return Request Fail';
export const CREATE_ORDER_RETURN_REQUEST_SUCCESS =
  '[User] Create Order Return Request Success';

export const LOAD_ORDER_RETURN_REQUEST =
  '[User] Load Order Return Request details';
export const LOAD_ORDER_RETURN_REQUEST_FAIL =
  '[User] Load Order Return Request details Fail';
export const LOAD_ORDER_RETURN_REQUEST_SUCCESS =
  '[User] Load Order Return Request details Success';

export const LOAD_ORDER_RETURN_REQUEST_LIST =
  '[User] Load User Order Return Request List';
export const LOAD_ORDER_RETURN_REQUEST_LIST_FAIL =
  '[User] Load User Order Return Request List Fail';
export const LOAD_ORDER_RETURN_REQUEST_LIST_SUCCESS =
  '[User] Load User Order Return Request List Success';

export const CLEAR_ORDER_RETURN_REQUEST =
  '[User] Clear Order Return Request Details';
export const CLEAR_ORDER_RETURN_REQUEST_LIST =
  '[User] Clear Order Return Request List';

export class CreateOrderReturnRequest extends LoaderLoadAction {
  readonly type = CREATE_ORDER_RETURN_REQUEST;
  constructor(
    public payload: {
      userId: string;
      returnRequestInput: ReturnRequestEntryInputList;
    }
  ) {
    super(USER_RETURN_REQUEST_DETAILS);
  }
}

export class CreateOrderReturnRequestFail extends LoaderFailAction {
  readonly type = CREATE_ORDER_RETURN_REQUEST_FAIL;
  constructor(public payload: any) {
    super(USER_RETURN_REQUEST_DETAILS, payload);
  }
}

export class CreateOrderReturnRequestSuccess extends LoaderSuccessAction {
  readonly type = CREATE_ORDER_RETURN_REQUEST_SUCCESS;
  constructor(public payload: ReturnRequest) {
    super(USER_RETURN_REQUEST_DETAILS);
  }
}

export class LoadOrderReturnRequest extends LoaderLoadAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST;
  constructor(
    public payload: {
      userId: string;
      returnRequestCode: string;
    }
  ) {
    super(USER_RETURN_REQUEST_DETAILS);
  }
}

export class LoadOrderReturnRequestFail extends LoaderFailAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST_FAIL;
  constructor(public payload: any) {
    super(USER_RETURN_REQUEST_DETAILS, payload);
  }
}

export class LoadOrderReturnRequestSuccess extends LoaderSuccessAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST_SUCCESS;
  constructor(public payload: ReturnRequest) {
    super(USER_RETURN_REQUEST_DETAILS);
  }
}

export class LoadOrderReturnRequestList extends LoaderLoadAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST_LIST;
  constructor(
    public payload: {
      userId: string;
      pageSize?: number;
      currentPage?: number;
      sort?: string;
    }
  ) {
    super(USER_RETURN_REQUESTS);
  }
}

export class LoadOrderReturnRequestListFail extends LoaderFailAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST_LIST_FAIL;
  constructor(public payload: any) {
    super(USER_RETURN_REQUESTS, payload);
  }
}

export class LoadOrderReturnRequestListSuccess extends LoaderSuccessAction {
  readonly type = LOAD_ORDER_RETURN_REQUEST_LIST_SUCCESS;
  constructor(public payload: ReturnRequestList) {
    super(USER_RETURN_REQUESTS);
  }
}

export class ClearOrderReturnRequest extends LoaderResetAction {
  readonly type = CLEAR_ORDER_RETURN_REQUEST;
  constructor() {
    super(USER_RETURN_REQUEST_DETAILS);
  }
}

export class ClearOrderReturnRequestList extends LoaderResetAction {
  readonly type = CLEAR_ORDER_RETURN_REQUEST_LIST;
  constructor() {
    super(USER_RETURN_REQUESTS);
  }
}

export type OrderReturnRequestAction =
  | CreateOrderReturnRequest
  | CreateOrderReturnRequestFail
  | CreateOrderReturnRequestSuccess
  | LoadOrderReturnRequest
  | LoadOrderReturnRequestFail
  | LoadOrderReturnRequestSuccess
  | LoadOrderReturnRequestList
  | LoadOrderReturnRequestListFail
  | LoadOrderReturnRequestListSuccess
  | ClearOrderReturnRequest
  | ClearOrderReturnRequestList;
