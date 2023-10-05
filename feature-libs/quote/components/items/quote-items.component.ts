/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { CartOutlets, ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { Quote, QuoteFacade } from '@spartacus/quote/root';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { QuoteItemsComponentService } from './quote-items.component.service';

@Component({
  selector: 'cx-quote-items',
  templateUrl: './quote-items.component.html',
})
export class QuoteItemsComponent {
  quoteDetails$: Observable<Quote> = this.quoteFacade.getQuoteDetails();
  cartDetails$: Observable<Cart> = this.activeCartFacade.getActive();
  showCart$ = this.quoteItemsService.getQuoteEntriesExpanded();
  iconTypes = ICON_TYPE;
  readonly cartOutlets = CartOutlets;
  protected subscription: Subscription;

  constructor(
    protected quoteFacade: QuoteFacade,
    protected activeCartFacade: ActiveCartFacade,
    protected quoteItemsService: QuoteItemsComponentService
  ) {}

  onToggleShowOrHideCart(showCart: boolean) {
    this.quoteItemsService.setQuoteEntriesExpanded(!showCart);
  }
}
