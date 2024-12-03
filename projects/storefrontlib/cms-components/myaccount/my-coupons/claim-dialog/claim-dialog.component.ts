/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';

import {
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
  } from '@angular/forms';

import { Subscription } from 'rxjs';


import {
  RoutingService,
  CustomerCouponService,
  GlobalMessageService,
  GlobalMessageType,
  useFeatureStyles,
} from '@spartacus/core';
import { FocusConfig, LaunchDialogService } from '../../../../layout/index';
import { ICON_TYPE } from '@spartacus/storefront';


@Component({
  selector: 'cx-claim-dialog',
  templateUrl: './claim-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class ClaimDialogComponent implements OnDestroy, OnInit {

  private subscription = new Subscription();
  iconTypes = ICON_TYPE;
  private pageSize = 10;

  @Input() couponCode: string;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  form: UntypedFormGroup = new UntypedFormGroup(
        {
          couponCode: new UntypedFormControl('', [Validators.required]),
        }
  );

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }
  constructor(
    protected couponService: CustomerCouponService,
    protected routingService: RoutingService,
    protected messageService: GlobalMessageService,
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef

  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data) {
          this.couponCode = data.coupon;
          this.pageSize=data.pageSize;
          (this.form.get('couponCode') as UntypedFormControl).setValue(this.couponCode);
        }
      })
    );
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
      const couponVal = (this.form.get('couponCode') as UntypedFormControl).value;
      if (couponVal) {
        this.couponService.claimCustomerCoupon(couponVal);
        this.subscription = this.couponService
          .getClaimCustomerCouponResultSuccess()
          .subscribe((success) => {
            if (success) {
              this.messageService.add(
                { key: 'myCoupons.claimCustomerCoupon' },
                GlobalMessageType.MSG_TYPE_CONFIRMATION
              );
            }
            this.routingService.go({ cxRoute: 'coupons'});
            this.couponService.loadCustomerCoupons(this.pageSize);
            this.close('Cross click');
          });
      } else {
        this.routingService.go({ cxRoute: 'notFound' });
      }

  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  cancelEdit(): void {
    (this.form.get('couponCode') as UntypedFormControl).setValue(this.couponCode);
  }
}
