/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuoteCartService {
  private quoteId: Observable<string> = new ReplaySubject<string>(1);
  private quoteCartActive: Observable<boolean> = new ReplaySubject<boolean>(1);
  private checkoutAllowed: Observable<boolean> = new ReplaySubject<boolean>(1);

  constructor() {
    (this.quoteCartActive as ReplaySubject<boolean>).next(false);
    (this.checkoutAllowed as ReplaySubject<boolean>).next(false);
    (this.quoteId as ReplaySubject<string>).next('');
  }

  public setQuoteId(quoteId: string): void {
    (this.quoteId as ReplaySubject<string>).next(quoteId);
  }

  public getQuoteId(): Observable<string> {
    return this.quoteId;
  }

  public setQuoteCartActive(quoteCartActive: boolean): void {
    (this.quoteCartActive as ReplaySubject<boolean>).next(quoteCartActive);
  }

  public getQuoteCartActive(): Observable<boolean> {
    return this.quoteCartActive;
  }

  public setCheckoutAllowed(checkoutAllowed: boolean): void {
    (this.checkoutAllowed as ReplaySubject<boolean>).next(checkoutAllowed);
  }

  public isCheckoutAllowed(): Observable<boolean> {
    return this.checkoutAllowed;
  }
}
