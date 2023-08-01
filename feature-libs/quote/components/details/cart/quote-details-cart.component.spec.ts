import { TestBed } from '@angular/core/testing';
import { QuoteDetailsCartComponent } from './quote-details-cart.component';
import { Quote, QuoteFacade } from '@spartacus/quote/root';

import { I18nTestingModule } from '@spartacus/core';
import { IconTestingModule, OutletDirective } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import {
  QUOTE_CODE,
  createEmptyQuote,
} from '../../../core/testing/quote-test-utils';
import { By } from '@angular/platform-browser';
import { Directive, Input } from '@angular/core';

const quote: Quote = createEmptyQuote();

class MockQuoteFacade implements Partial<QuoteFacade> {
  getQuoteDetails(): Observable<Quote> {
    return of(quote);
  }
}

@Directive({
  selector: '[cxOutlet]',
})
class MockOutletDirective implements Partial<OutletDirective> {
  @Input() cxOutlet: string;
  @Input() cxOutletContext: {};
}

describe('QuoteDetailsCartComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, IconTestingModule],
      declarations: [QuoteDetailsCartComponent, MockOutletDirective],
      providers: [
        {
          provide: QuoteFacade,
          useClass: MockQuoteFacade,
        },
      ],
    });
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(QuoteDetailsCartComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should per default display CARET_UP', () => {
    const fixture = TestBed.createComponent(QuoteDetailsCartComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain(
      'CARET_UP'
    );
  });

  it('should toggle caret when clicked', () => {
    const fixture = TestBed.createComponent(QuoteDetailsCartComponent);
    fixture.detectChanges();
    const caret = fixture.debugElement.query(
      By.css('.cart-toggle')
    ).nativeElement;
    caret.click();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain(
      'CARET_DOWN'
    );
  });

  it('should provide quote details observable', (done) => {
    const fixture = TestBed.createComponent(QuoteDetailsCartComponent);
    const component = fixture.componentInstance;
    component.quoteDetails$.subscribe((quoteDetails) => {
      expect(quoteDetails.code).toBe(QUOTE_CODE);
      done();
    });
  });
});
