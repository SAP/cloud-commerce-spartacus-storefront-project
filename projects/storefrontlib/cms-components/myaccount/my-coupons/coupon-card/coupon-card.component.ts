/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CustomerCoupon } from '@spartacus/core';
import { LaunchDialogService, LAUNCH_CALLER } from '../../../../layout/index';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MyCouponsComponentService } from '../my-coupons.component.service';
import { MockDatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';
import { CxDatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { AsyncPipe, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'cx-coupon-card',
  templateUrl: './coupon-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    LowerCasePipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class CouponCardComponent {
  @Input() coupon: CustomerCoupon;
  @Input() couponSubscriptionLoading$: Observable<boolean>;

  @Output()
  notificationChanged = new EventEmitter<{
    couponId: string;
    notification: boolean;
  }>();

  @ViewChild('element') element: ElementRef;

  constructor(
    protected myCouponsComponentService: MyCouponsComponentService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef
  ) {}

  onSubscriptionChange(): void {
    this.notificationChanged.emit({
      couponId: this.coupon.couponId ?? '',
      notification: !this.coupon.notificationOn,
    });
  }

  readMore() {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.COUPON,
      this.element,
      this.vcr,
      { coupon: this.coupon }
    );

    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }

  findProducts(): void {
    this.myCouponsComponentService.launchSearchPage(this.coupon);
  }
}
