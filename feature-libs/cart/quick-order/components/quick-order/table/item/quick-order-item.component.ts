/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { OrderEntry } from '@spartacus/cart/base/root';
import { QuickOrderFacade } from '@spartacus/cart/quick-order/root';
import { useFeatureStyles } from '@spartacus/core';
import { Subscription } from 'rxjs';
import { MockTranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { ItemCounterComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { MediaComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: '[cx-quick-order-item], cx-quick-order-item',
  templateUrl: './quick-order-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    MediaComponent,
    FeatureDirective,
    ItemCounterComponent,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class QuickOrderItemComponent implements OnInit, OnDestroy {
  quantityControl: UntypedFormControl;

  get entry(): OrderEntry {
    return this._entry;
  }

  @Input('entry') set entry(value: OrderEntry) {
    this._entry = value;
    this.quantityControl = new UntypedFormControl(this.entry.quantity, {
      updateOn: 'blur',
    });
  }

  @Input()
  index: number;

  @Input()
  loading: boolean = false;

  protected _entry: OrderEntry;
  protected subscription = new Subscription();

  constructor(
    protected cd: ChangeDetectorRef,
    protected quickOrderService: QuickOrderFacade
  ) {
    useFeatureStyles('a11yCartItemsLinksStyles');
    useFeatureStyles('a11yQTY2Quantity');
  }

  ngOnInit(): void {
    this.subscription.add(
      this.quantityControl.valueChanges.subscribe(() => {
        this.quickOrderService.updateEntryQuantity(
          this.index,
          this.quantityControl.value
        );
      })
    );

    this.subscription.add(this.watchProductAdd());
  }

  removeEntry(): void {
    this.quickOrderService.softDeleteEntry(this.index);
    this.cd.detectChanges();
  }

  protected watchProductAdd(): Subscription {
    return this.quickOrderService.getProductAdded().subscribe((productCode) => {
      if (productCode === this.entry.product?.code) {
        this.quantityControl = new UntypedFormControl(this.entry.quantity);
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
