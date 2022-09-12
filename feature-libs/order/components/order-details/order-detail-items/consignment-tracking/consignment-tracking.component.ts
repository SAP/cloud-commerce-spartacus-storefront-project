/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Consignment,
  ConsignmentTracking,
  OrderHistoryFacade,
} from '@commerce-storefront-toolset/order/root';
import { ModalRef, ModalService } from '@commerce-storefront-toolset/storefront';
import { Observable } from 'rxjs';
import { TrackingEventsComponent } from './tracking-events/tracking-events.component';

@Component({
  selector: 'cx-consignment-tracking',
  templateUrl: './consignment-tracking.component.html',
})
export class ConsignmentTrackingComponent implements OnInit, OnDestroy {
  consignmentStatus: string[] = [
    'SHIPPED',
    'IN_TRANSIT',
    'DELIVERY_COMPLETED',
    'DELIVERY_REJECTED',
    'DELIVERING',
  ];
  modalRef: ModalRef;

  @Input()
  consignment: Consignment;
  @Input()
  orderCode: string;
  consignmentTracking$: Observable<ConsignmentTracking>;

  constructor(
    private orderHistoryFacade: OrderHistoryFacade,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.consignmentTracking$ =
      this.orderHistoryFacade.getConsignmentTracking();
  }

  openTrackingDialog(consignment: Consignment) {
    if (consignment.code) {
      this.orderHistoryFacade.loadConsignmentTracking(
        this.orderCode,
        consignment.code
      );
    }
    let modalInstance: any;
    this.modalRef = this.modalService.open(TrackingEventsComponent, {
      centered: true,
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.tracking$ = this.consignmentTracking$;
    modalInstance.shipDate = consignment.statusDate;
    modalInstance.consignmentCode = consignment.code;
  }

  ngOnDestroy(): void {
    this.orderHistoryFacade.clearConsignmentTracking();
  }
}
