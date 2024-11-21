/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ConsignmentTracking, OrderHistoryFacade } from '@spartacus/order/root';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { CxDatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FocusDirective } from '@spartacus/storefront';

@Component({
  selector: 'cx-tracking-events',
  templateUrl: './tracking-events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FocusDirective,
    NgIf,
    NgFor,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    CxDatePipe,
  ],
})
export class TrackingEventsComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  tracking$: Observable<ConsignmentTracking>;
  shipDate: Date;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected orderHistoryFacade: OrderHistoryFacade,
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data) {
          this.init(data.tracking$, data.shipDate);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.orderHistoryFacade.clearConsignmentTracking();
    this.subscription?.unsubscribe();
  }

  init(tracking$: Observable<ConsignmentTracking>, shipDate: Date) {
    this.tracking$ = tracking$;
    this.shipDate = shipDate;
  }

  close(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }
}
