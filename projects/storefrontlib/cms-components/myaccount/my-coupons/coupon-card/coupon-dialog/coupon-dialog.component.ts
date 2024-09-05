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
import { CustomerCoupon, FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { Subscription } from 'rxjs';
import { ICON_TYPE } from '../../../../../cms-components/misc/icon/index';
import { FocusConfig, LaunchDialogService } from '../../../../../layout/index';
import { LowerCasePipe } from '@angular/common';
import { IconComponent } from '../../../../misc/icon/icon.component';
import { FocusDirective } from '../../../../../layout/a11y/keyboard-focus/focus.directive';

@Component({
    selector: 'cx-coupon-dialog',
    templateUrl: './coupon-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FocusDirective,
        FeaturesConfigModule,
        IconComponent,
        LowerCasePipe,
        I18nModule,
    ],
})
export class CouponDialogComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  iconTypes = ICON_TYPE;
  coupon: CustomerCoupon;

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
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data) {
          this.coupon = data.coupon;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }
}
