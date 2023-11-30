/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Quote,
  QuoteDiscount,
  QuoteDiscountType,
  QuoteFacade,
  QuoteMetadata,
} from '@spartacus/quote/root';
import { ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, take } from 'rxjs/operators';
import { QuoteUIConfig } from '../../config';
import { QuoteSummarySellerEditComponentService } from './quote-summary-seller-edit.component.service';

@Component({
  selector: 'cx-quote-summary-seller-edit',
  templateUrl: './quote-summary-seller-edit.component.html',
})
export class QuoteSummarySellerEditComponent implements OnInit, OnDestroy {
  protected quoteFacade = inject(QuoteFacade);
  protected quoteHeaderSellerEditComponentService = inject(
    QuoteSummarySellerEditComponentService
  );
  protected quoteUIConfig = inject(QuoteUIConfig);

  quoteDetailsForSeller$: Observable<Quote> = this.quoteFacade
    .getQuoteDetails()
    .pipe(
      filter((quote) =>
        this.quoteHeaderSellerEditComponentService.isEditable(quote)
      )
    );

  @ViewChild('element') element: ElementRef;

  form: UntypedFormGroup = new UntypedFormGroup({
    discount: new UntypedFormControl(),
    validityDate: new UntypedFormControl(),
  });

  iconType = ICON_TYPE;
  discountPlaceholder: string;

  protected subscription: Subscription = new Subscription();

  protected dateUpdates: Subject<{ quoteCode: string; date: string }> =
    new Subject();

  ngOnInit(): void {
    //We need the subscription member even if we use take(1):
    //quoteDetailsForSeller$ might never emit
    this.subscription.add(
      combineLatest([
        this.quoteHeaderSellerEditComponentService.getLocalizationElements(),
        this.quoteDetailsForSeller$,
      ])
        .pipe(take(1))
        .subscribe(([localizationElements, quote]) => {
          this.discountPlaceholder = localizationElements.currencySymbol;
          const numberFormatValidator =
            this.quoteHeaderSellerEditComponentService.getNumberFormatValidator(
              localizationElements.locale,
              localizationElements.currencySymbol,
              this.quoteHeaderSellerEditComponentService.getMaximumNumberOfTotalPlaces(
                quote
              )
            );
          this.form.controls.discount.addValidators([numberFormatValidator]);
          const discountValue = quote.quoteDiscounts?.value;
          if (discountValue) {
            this.form.controls.discount.setValue(
              localizationElements.formatter.format(discountValue)
            );
          }
          this.form.controls.validityDate.setValue(
            this.quoteHeaderSellerEditComponentService.removeTimeFromDate(
              quote.expirationTime?.toString()
            )
          );
        })
    );
    this.subscription.add(
      this.dateUpdates
        .pipe(
          debounceTime(
            this.quoteUIConfig.quote?.updateDebounceTime?.expiryDate ?? 500
          )
        )
        .subscribe((payload) => {
          const quoteMetaData: QuoteMetadata = {
            expirationTime: payload.date,
          };
          this.quoteFacade.editQuote(payload.quoteCode, quoteMetaData);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Should the validation message be displayed?
   *
   * @returns True in case discount control has errors
   */
  mustDisplayValidationMessage(): boolean {
    return !this.form.controls.discount.valid;
  }

  /**
   * Parses current discount from control and sends absolute discount to the facade layer.
   *
   * @param quoteCode - Quote code
   */
  onApply(quoteCode: string): void {
    if (this.form.controls.discount.valid) {
      combineLatest([
        this.quoteHeaderSellerEditComponentService.parseDiscountValue(
          this.form.controls.discount.value
        ),
        this.quoteHeaderSellerEditComponentService.getFormatter(),
      ])
        .pipe(take(1))
        .subscribe(([parsedValue, formatter]) => {
          const discount: QuoteDiscount = {
            discountRate: parsedValue,
            discountType: QuoteDiscountType.ABSOLUTE,
          };
          this.quoteFacade.addDiscount(quoteCode, discount);
          this.form.controls.discount.setValue(formatter.format(parsedValue));
        });
    }
  }

  /**
   * Prepares date for facade layer and sends it.
   *
   * @param quoteCode - Quote code
   */
  onSetDate(quoteCode: string): void {
    const dateWithTime =
      this.quoteHeaderSellerEditComponentService.addTimeToDate(
        this.form.controls.validityDate.value
      );
    this.dateUpdates.next({ quoteCode: quoteCode, date: dateWithTime });
  }
}
