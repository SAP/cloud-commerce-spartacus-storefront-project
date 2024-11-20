/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetailsService } from '../order-details.service';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-order-details-actions',
  templateUrl: './order-detail-actions.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class OrderDetailActionsComponent {
  constructor(protected orderDetailsService: OrderDetailsService) {}

  order$: Observable<any> = this.orderDetailsService.getOrderDetails();
}
