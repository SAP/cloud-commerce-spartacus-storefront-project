/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderEntry } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderAmendService } from '../../amend-order.service';
import { AmendOrderActionsComponent } from '../../amend-order-actions/amend-order-actions.component';
import { CancelOrReturnItemsComponent } from '../../amend-order-items/amend-order-items.component';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
    selector: 'cx-cancel-order-confirmation',
    templateUrl: './cancel-order-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        NgTemplateOutlet,
        CancelOrReturnItemsComponent,
        AmendOrderActionsComponent,
        AsyncPipe,
    ],
})
export class CancelOrderConfirmationComponent {
  orderCode: string;

  form$ = this.orderAmendService
    .getForm()
    .pipe(tap((form) => (this.orderCode = form.value.orderCode)));

  entries$: Observable<OrderEntry[]> =
    this.orderAmendService.getAmendedEntries();

  constructor(protected orderAmendService: OrderAmendService) {}

  submit(form: UntypedFormGroup) {
    if (form.valid) {
      this.orderAmendService.save();
    } else {
      form.markAllAsTouched();
    }
  }
}
