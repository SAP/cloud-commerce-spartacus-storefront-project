import { Injectable } from '@angular/core';
import {
  Order,
  OrderApproval,
  OrderApprovalService,
  RoutingService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  pluck,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderApprovalDetailService {
  protected approvalCode$ = this.routingService
    .getRouterState()
    .pipe(map((routingData) => routingData.state.params.approvalCode));

  protected orderApproval$ = this.approvalCode$.pipe(
    filter(Boolean),
    tap((approvalCode: string) =>
      this.orderApprovalService.loadOrderApproval(approvalCode)
    ),
    switchMap((approvalCode: string) =>
      this.orderApprovalService.get(approvalCode)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected order$ = this.orderApproval$.pipe(pluck('order'));

  constructor(
    protected routingService: RoutingService,
    protected orderApprovalService: OrderApprovalService
  ) {}

  getOrderDetails(): Observable<Order> {
    return this.order$;
  }

  getOrderApproval(): Observable<OrderApproval> {
    return this.orderApproval$;
  }
}
