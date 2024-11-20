/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActiveCartFacade, Cart, CartOutlets } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { OutletDirective } from '../../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';

@Component({
  selector: 'cx-checkout-order-summary',
  templateUrl: './checkout-order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OutletDirective, AsyncPipe],
})
export class CheckoutOrderSummaryComponent {
  cart$: Observable<Cart>;

  readonly cartOutlets = CartOutlets;

  constructor(protected activeCartFacade: ActiveCartFacade) {
    this.cart$ = this.activeCartFacade.getActive();
  }
}
