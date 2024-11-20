/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { Consignment, Order } from '@spartacus/order/root';
import { OutletContextData } from '@spartacus/storefront';
import { ConsignmentTrackingComponent } from '../../order-detail-items';
import { MockDatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { CxDatePipe } from '../../../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { NgIf } from '@angular/common';
type ConsignmentOutletContextData = { item: Consignment; order?: Order };
@Component({
  selector: 'cx-my-account-v2-consignment-tracking',
  templateUrl: './my-account-v2-consignment-tracking.component.html',
  standalone: true,
  imports: [NgIf, TranslatePipe, CxDatePipe, MockTranslatePipe, MockDatePipe],
})
export class MyAccountV2ConsignmentTrackingComponent
  extends ConsignmentTrackingComponent
  implements OnInit
{
  @HostBinding('className') componentClass: string = 'cx-list-header col-12';
  protected outlet = inject(OutletContextData);

  ngOnInit(): void {
    this.outlet?.context$.subscribe((context: ConsignmentOutletContextData) => {
      this.consignment = context.item;
    });
    this.outlet?.context$.subscribe((context: ConsignmentOutletContextData) => {
      this.orderCode = context?.order?.code ?? '';
    });
    super.ngOnInit();
  }
}
