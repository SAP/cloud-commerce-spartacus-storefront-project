/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
    IconModule,
    OutletPosition,
    provideOutlet,
} from '@spartacus/storefront';
import { CpqQuoteDiscountComponent } from './components/cpq-quote-discount-tbody/cpq-quote.component';
import { CpqQuoteHeadingComponent } from './components/cpq-quote-heading/cpq-quote-heading.component';
import { CpqQuoteOfferComponent } from './components/cpq-quote/cpq-quote-offer.component';

import { CommonModule } from '@angular/common';
import { CartItemListComponentService } from '@spartacus/cart/base/components';
import { CartOutlets } from '@spartacus/cart/base/root';
import { I18nModule, UrlModule } from '@spartacus/core';
import { CpqQuoteSharedService } from './cpq-qute-shared.service';
import { CpqQuoteService } from './cpq-qute.service';

@NgModule({
  imports: [CommonModule, UrlModule, I18nModule, IconModule],

  declarations: [
    CpqQuoteHeadingComponent,
    CpqQuoteDiscountComponent,
    CpqQuoteOfferComponent,
  ],
  exports: [
    CpqQuoteHeadingComponent,
    CpqQuoteDiscountComponent,
    CpqQuoteOfferComponent,
  ],
  providers: [
    CpqQuoteService,
    { provide: CartItemListComponentService, useClass: CpqQuoteSharedService },
    provideOutlet({
      id: CartOutlets.CPQ_QUOTE_MODULE,
      position: OutletPosition.AFTER,
      component: CpqQuoteDiscountComponent,
    }),
    provideOutlet({
      id: CartOutlets.CPQ_QUOTE_HEADING,
      position: OutletPosition.AFTER,
      component: CpqQuoteHeadingComponent,
    }),
    provideOutlet({
      id: CartOutlets.CPQ_QUOTE,
      position: OutletPosition.AFTER,
      component: CpqQuoteOfferComponent,
    }),
  ],
})
export class CpqDiscountModule {}
