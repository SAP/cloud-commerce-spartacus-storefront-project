import { PROCESS_FEATURE } from 'projects/core/src/process/store/process-state';
import { StateUtils } from 'projects/core/src/state/utils/index';
import { ListModel } from '../../../model/misc.model';
import {
  OrderApproval,
  OrderApprovalDecision,
} from '../../../model/order-approval.model';
import {
  EntityFailAction,
  EntityLoadAction,
  EntitySuccessAction,
} from '../../../state/utils/entity-loader/entity-loader.action';
import { B2BSearchConfig } from '../../model/search-config';
import { serializeB2BSearchConfig } from '../../utils/serializer';
import {
  ORDER_APPROVAL_ENTITIES,
  ORDER_APPROVAL_LIST,
  ORDER_APPROVAL_MAKE_DECISION_PROCESS_ID,
} from '../organization-state';

export const LOAD_ORDER_APPROVAL = '[OrderApproval] Load OrderApproval Data';
export const LOAD_ORDER_APPROVAL_FAIL =
  '[OrderApproval] Load OrderApproval Data Fail';
export const LOAD_ORDER_APPROVAL_SUCCESS =
  '[OrderApproval] Load OrderApproval Data Success';

export const LOAD_ORDER_APPROVALS = '[OrderApproval] Load OrderApprovals';
export const LOAD_ORDER_APPROVALS_FAIL =
  '[OrderApproval] Load OrderApprovals Fail';
export const LOAD_ORDER_APPROVALS_SUCCESS =
  '[OrderApproval] Load OrderApprovals Success';

export const MAKE_DECISION = '[OrderApproval] Make OrderApproval Decision';
export const MAKE_DECISION_FAIL =
  '[OrderApproval] Make OrderApproval Decision Fail';
export const MAKE_DECISION_SUCCESS =
  '[OrderApproval] Make OrderApproval Decision Success';
export const MAKE_DECISION_RESET =
  '[OrderApproval] Make OrderApproval Decision Reset';

export class LoadOrderApproval extends EntityLoadAction {
  readonly type = LOAD_ORDER_APPROVAL;
  constructor(public payload: { userId: string; orderApprovalCode: string }) {
    super(ORDER_APPROVAL_ENTITIES, payload.orderApprovalCode);
  }
}

export class LoadOrderApprovalFail extends EntityFailAction {
  readonly type = LOAD_ORDER_APPROVAL_FAIL;
  constructor(public payload: { orderApprovalCode: string; error: any }) {
    super(ORDER_APPROVAL_ENTITIES, payload.orderApprovalCode, payload.error);
  }
}

export class LoadOrderApprovalSuccess extends EntitySuccessAction {
  readonly type = LOAD_ORDER_APPROVAL_SUCCESS;
  constructor(public payload: OrderApproval[]) {
    super(
      ORDER_APPROVAL_ENTITIES,
      payload.map((orderApproval) => orderApproval.code)
    );
  }
}

export class LoadOrderApprovals extends EntityLoadAction {
  readonly type = LOAD_ORDER_APPROVALS;
  constructor(
    public payload: {
      userId: string;
      params: B2BSearchConfig;
    }
  ) {
    super(ORDER_APPROVAL_LIST, serializeB2BSearchConfig(payload.params));
  }
}

export class LoadOrderApprovalsFail extends EntityFailAction {
  readonly type = LOAD_ORDER_APPROVALS_FAIL;
  constructor(public payload: { params: B2BSearchConfig; error: any }) {
    super(
      ORDER_APPROVAL_LIST,
      serializeB2BSearchConfig(payload.params),
      payload.error
    );
  }
}

export class LoadOrderApprovalsSuccess extends EntitySuccessAction {
  readonly type = LOAD_ORDER_APPROVALS_SUCCESS;
  constructor(
    public payload: {
      page: ListModel;
      params: B2BSearchConfig;
    }
  ) {
    super(ORDER_APPROVAL_LIST, serializeB2BSearchConfig(payload.params));
  }
}

export class MakeDecision extends StateUtils.EntityLoadAction {
  readonly type = MAKE_DECISION;
  constructor(
    public payload: {
      userId: string;
      orderApprovalCode: string;
      orderApprovalDecision: OrderApprovalDecision;
    }
  ) {
    super(PROCESS_FEATURE, ORDER_APPROVAL_MAKE_DECISION_PROCESS_ID);
  }
}

export class MakeDecisionFail extends StateUtils.EntityFailAction {
  readonly type = MAKE_DECISION_FAIL;
  constructor(public payload: { orderApprovalCode: string; error: any }) {
    super(PROCESS_FEATURE, ORDER_APPROVAL_MAKE_DECISION_PROCESS_ID, payload);
  }
}

export class MakeDecisionSuccess extends StateUtils.EntitySuccessAction {
  readonly type = MAKE_DECISION_SUCCESS;
  constructor(
    public payload: {
      orderApprovalCode: string;
      orderApprovalDecision: OrderApprovalDecision;
    }
  ) {
    super(PROCESS_FEATURE, ORDER_APPROVAL_MAKE_DECISION_PROCESS_ID);
  }
}

export class MakeDecisionReset extends StateUtils.EntityLoaderResetAction {
  readonly type = MAKE_DECISION_RESET;
  constructor() {
    super(PROCESS_FEATURE, ORDER_APPROVAL_MAKE_DECISION_PROCESS_ID);
  }
}

export type OrderApprovalAction =
  | LoadOrderApproval
  | LoadOrderApprovalFail
  | LoadOrderApprovalSuccess
  | LoadOrderApprovals
  | LoadOrderApprovalsFail
  | LoadOrderApprovalsSuccess
  | MakeDecision
  | MakeDecisionFail
  | MakeDecisionSuccess
  | MakeDecisionReset;
