/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { OrderEntry } from '@spartacus/cart/base/root';
import { Images } from '@spartacus/core';
import { OrderConsignmentsService } from '../../../order-details';
import {
  ConsignmentView,
  OrderView,
  OrderHistoryView,
} from '@spartacus/order/root';
import { OrderCriticalStatus } from '../order-history-extended.model';

@Component({
  selector: 'cx-order-consolidated-information',
  templateUrl: './order-consolidated-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConsolidatedInformationComponent {
  protected orderConsignmentsService = inject(OrderConsignmentsService);
  protected criticalStatuses = Object.values(OrderCriticalStatus);
  @Input()
  order?: OrderHistoryView;
  protected IMAGE_COUNT = 4; //showing fixed no.of images, without using carousel
  getConsignmentsCount(consignments: ConsignmentView[] | undefined): number {
    let count = 0;
    if (consignments) {
      for (const consignment of consignments) {
        if (consignment.entries) {
          count = count + consignment.entries.length;
        }
      }
    }
    return count;
  }

  getOrderEntriesCount(orderEntries: OrderEntry[] | undefined): number {
    if (orderEntries) {
      return orderEntries.length;
    }
    return 0;
  }

  isStatusCritical(status: string): boolean {
    if (
      this.criticalStatuses.includes(
        status.toUpperCase() as OrderCriticalStatus
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  getPickupConsignments(consignments: ConsignmentView[]): ConsignmentView[] {
    const orderDetail: OrderView = {};
    orderDetail.consignments = consignments;
    return (
      this.orderConsignmentsService.getGroupedConsignments(orderDetail, true) ??
      []
    );
  }
  getDeliveryConsignments(consignments: ConsignmentView[]): ConsignmentView[] {
    const orderDetail: OrderView = {};
    orderDetail.consignments = consignments;
    return (
      this.orderConsignmentsService.getGroupedConsignments(
        orderDetail,
        false
      ) ?? []
    );
  }
  getDeliveryUnconsignedEntries(
    unconsignedEntries: OrderEntry[]
  ): OrderEntry[] {
    const orderDetail: OrderView = {};
    orderDetail.unconsignedEntries = unconsignedEntries;
    return (
      this.orderConsignmentsService.getUnconsignedEntries(orderDetail, false) ??
      []
    );
  }
  getPickupUnconsignedEntries(unconsignedEntries: OrderEntry[]): OrderEntry[] {
    const orderDetail: OrderView = {};
    orderDetail.unconsignedEntries = unconsignedEntries;
    return (
      this.orderConsignmentsService.getUnconsignedEntries(orderDetail, true) ??
      []
    );
  }
  getProductImages(entries: OrderEntry[]): Images[] {
    const images: Images[] = [];
    let index = 0;
    for (const item of entries) {
      if (item.product?.images) {
        if (index >= this.IMAGE_COUNT) {
          break;
        }
        index++;
        images.push(item.product?.images);
      }
    }
    return images;
  }
}
