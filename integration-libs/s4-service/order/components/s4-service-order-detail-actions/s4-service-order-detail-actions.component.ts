/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OrderDetailActionsComponent } from '@spartacus/order/components';
import { Order } from '@spartacus/order/root';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'cx-s4-service-order-detail-actions',
  templateUrl: './s4-service-order-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class S4ServiceOrderDetailActionsComponent extends OrderDetailActionsComponent {
  displayCancelActions$: Observable<boolean> = this.order$.pipe(
    map((order) => this.checkIfOrderContainsServiceProduct(order))
  );
  checkIfOrderContainsServiceProduct(order: Order): boolean {
    const entries = order.entries || [];
    const hasServiceProduct = entries.some((entry) =>
      entry.product?.productTypes?.includes('SERVICE')
    );
    if ((order && order.status === 'CANCELLED') || !hasServiceProduct) {
      return false;
    } else {
      return true;
    }
  }
}
