import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { OrderApprovalAdapter } from '../../../organization/connectors/order-approval/order-approval.adapter';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { ConverterService } from '../../../util/converter.service';
import {
  ORDER_APPROVAL_NORMALIZER,
  ORDER_APPROVALS_NORMALIZER,
  ORDER_APPROVAL_DECISION_NORMALIZER,
} from '../../../organization/connectors/order-approval/converters';
import { B2BSearchConfig } from '../../../organization/model/search-config';
import { Occ } from '../../occ-models/occ.models';
import {
  OrderApprovalDecision,
  OrderApproval,
} from '../../../model/order-approval.model';
import { EntitiesModel } from '../../../model/misc.model';

@Injectable()
export class OccOrderApprovalAdapter implements OrderApprovalAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(userId: string, orderApprovalCode: string): Observable<OrderApproval> {
    return this.http
      .get<Occ.OrderApproval>(
        this.getOrderApprovalEndpoint(userId, orderApprovalCode)
      )
      .pipe(this.converter.pipeable(ORDER_APPROVAL_NORMALIZER));
  }

  loadList(
    userId: string,
    params?: B2BSearchConfig
  ): Observable<EntitiesModel<OrderApproval>> {
    return this.http
      .get<Occ.OrderApprovalsList>(
        this.getOrderApprovalsEndpoint(userId, params)
      )
      .pipe(this.converter.pipeable(ORDER_APPROVALS_NORMALIZER));
  }

  makeDecision(
    userId: string,
    orderApprovalCode: string,
    orderApprovalDecision: OrderApprovalDecision
  ): Observable<OrderApprovalDecision> {
    return this.http
      .post<Occ.OrderApproval>(
        this.getOrderApprovalDecisionEndpoint(userId, orderApprovalCode),
        orderApprovalDecision
      )
      .pipe(this.converter.pipeable(ORDER_APPROVAL_DECISION_NORMALIZER));
  }

  protected getOrderApprovalEndpoint(
    userId: string,
    orderApprovalCode: string
  ): string {
    return this.occEndpoints.getUrl('orderApproval', {
      userId,
      orderApprovalCode,
    });
  }

  protected getOrderApprovalsEndpoint(
    userId: string,
    params?: B2BSearchConfig
  ): string {
    return this.occEndpoints.getUrl('orderApprovals', { userId }, params);
  }

  protected getOrderApprovalDecisionEndpoint(
    userId: string,
    orderApprovalCode: string
  ): string {
    return this.occEndpoints.getUrl('orderApprovalDecision', {
      userId,
      orderApprovalCode,
    });
  }
}
