/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ReplenishmentOrder,
  ReplenishmentOrderHistoryFacade,
} from '@spartacus/order/root';
import { LaunchDialogService, LAUNCH_CALLER } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-replenishment-order-cancellation',
  templateUrl: './replenishment-order-cancellation.component.html',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe, TranslatePipe, UrlPipe, TranslatePipe],
})
export class ReplenishmentOrderCancellationComponent implements OnDestroy {
  @ViewChild('element') element: ElementRef;

  private subscription = new Subscription();

  replenishmentOrder$: Observable<ReplenishmentOrder> =
    this.replenishmentOrderHistoryFacade.getReplenishmentOrderDetails();

  constructor(
    protected replenishmentOrderHistoryFacade: ReplenishmentOrderHistoryFacade,
    protected vcr: ViewContainerRef,
    protected launchDialogService: LaunchDialogService
  ) {}

  openDialog() {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.REPLENISHMENT_ORDER,
      this.element,
      this.vcr
    );

    if (dialog) {
      this.subscription.add(dialog.pipe(take(1)).subscribe());
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.replenishmentOrderHistoryFacade.clearReplenishmentOrderDetails();
  }
}
