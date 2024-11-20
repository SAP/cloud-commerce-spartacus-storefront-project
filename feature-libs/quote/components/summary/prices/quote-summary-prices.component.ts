/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { Price } from '@spartacus/core';
import { QuoteFacade } from '@spartacus/quote/root';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-quote-summary-prices',
  templateUrl: 'quote-summary-prices.component.html',
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslatePipe, MockTranslatePipe],
})
export class QuoteSummaryPricesComponent {
  protected quoteFacade = inject(QuoteFacade);

  quoteDetails$ = this.quoteFacade.getQuoteDetails();

  /**
   * Checks whether the price has a non-zero value.
   *
   * @param price - Price to check
   * @returns true, only if the price has a non zero value
   */
  hasNonZeroPriceValue(price?: Price): boolean {
    return !!price && !!price.value && price.value > 0;
  }
}
