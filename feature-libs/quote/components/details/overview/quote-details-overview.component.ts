/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { Quote, QuoteFacade } from '@spartacus/quote/root';
import { TranslationService } from '@spartacus/core';
import { Card } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'cx-quote-details-overview',
  templateUrl: './quote-details-overview.component.html',
})
export class QuoteDetailsOverviewComponent {
  quoteDetails$: Observable<Quote> = this.quoteFacade.getQuoteDetails().pipe(
    filter((state) => !state.loading),
    filter((state) => state.data !== undefined),
    map((state) => state.data),
    map((quote) => quote as Quote)
  );

  constructor(
    protected quoteFacade: QuoteFacade,
    protected translationService: TranslationService
  ) {}

  //TODO: consider to create similar generic function for all cx-card usages
  getCardContent(value: string | null, titleKey: string): Observable<Card> {
    return this.translationService.translate(titleKey).pipe(
      map((title) => ({
        title,
        text: [value ?? '-'],
      }))
    );
  }

  getTotalPrice(quote: Quote): string|null{
    return (quote.previousEstimatedTotal?.value
      ? quote.previousEstimatedTotal?.formattedValue
      : quote.totalPrice.formattedValue) ?? null;
  }
}
