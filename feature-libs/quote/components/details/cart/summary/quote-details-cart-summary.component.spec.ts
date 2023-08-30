import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  QuoteFacade,
  Quote,
  QuoteActionType,
  QuoteState,
} from '@spartacus/quote/root';
import {
  GlobalMessageService,
  I18nTestingModule,
  Price,
  TranslationService,
} from '@spartacus/core';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { QuoteDetailsCartSummaryComponent } from './quote-details-cart-summary.component';
import createSpy = jasmine.createSpy;
import {
  LAUNCH_CALLER,
  LaunchDialogService,
  OutletDirective,
} from '@spartacus/storefront';
import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { createEmptyQuote } from '../../../../core/testing/quote-test-utils';
import { CommonQuoteTestUtilsService } from '../../../testing/common-quote-test-utils.service';

const cartId = '1234';
const quoteCode = '3333';
const threshold = 20;
const totalPrice: Price = { value: threshold + 1 };

const quote: Quote = {
  ...createEmptyQuote(),
  allowedActions: [
    { type: QuoteActionType.EDIT, isPrimary: false },
    { type: QuoteActionType.REQUOTE, isPrimary: true },
  ],
  state: QuoteState.BUYER_DRAFT,
  cartId: cartId,
  code: quoteCode,
  threshold: threshold,
  totalPrice: totalPrice,
};

const mockQuoteDetails$ = new BehaviorSubject<Quote>(quote);

const dialogClose$ = new BehaviorSubject<any | undefined>(undefined);
class MockLaunchDialogService implements Partial<LaunchDialogService> {
  closeDialog(reason: any): void {
    dialogClose$.next(reason);
  }
  openDialog(
    _caller: LAUNCH_CALLER,
    _openElement?: ElementRef,
    _vcr?: ViewContainerRef,
    _data?: any
  ) {
    return of();
  }
  get dialogClose() {
    return dialogClose$.asObservable();
  }
}

class MockCommerceQuotesFacade implements Partial<QuoteFacade> {
  getQuoteDetails(): Observable<Quote> {
    return mockQuoteDetails$.asObservable();
  }
  performQuoteAction(
    _quoteCode: string,
    _quoteAction: QuoteActionType
  ): Observable<unknown> {
    return EMPTY;
  }
  requote = createSpy();
}

class MockTranslationService implements Partial<TranslationService> {
  translate(key: string): Observable<string> {
    return of(key);
  }
}

class MockGlobalMessageService {
  add(): void {}
}

@Directive({
  selector: '[cxOutlet]',
})
class MockOutletDirective implements Partial<OutletDirective> {
  @Input() cxOutlet: string;
  @Input() cxOutletContext: string;
}

describe('QuoteDetailsCartSummaryComponent', () => {
  let fixture: ComponentFixture<QuoteDetailsCartSummaryComponent>;
  let htmlElem: HTMLElement;
  let component: QuoteDetailsCartSummaryComponent;
  let facade: QuoteFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [QuoteDetailsCartSummaryComponent, MockOutletDirective],
      providers: [
        {
          provide: QuoteFacade,
          useClass: MockCommerceQuotesFacade,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        { provide: TranslationService, useClass: MockTranslationService },
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDetailsCartSummaryComponent);
    htmlElem = fixture.nativeElement;
    component = fixture.componentInstance;
    facade = TestBed.inject(QuoteFacade);
    mockQuoteDetails$.next(quote);
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(facade).toBeDefined();
  });

  describe('Ghost animation', () => {
    it('should render view for ghost animation', () => {
      mockQuoteDetails$.next(null);
      fixture.detectChanges();

      CommonQuoteTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-ghost-summary-heading'
      );

      CommonQuoteTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-ghost-title'
      );

      CommonQuoteTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-ghost-summary-partials'
      );

      CommonQuoteTestUtilsService.expectNumberOfElementsPresent(
        expect,
        htmlElem,
        '.cx-ghost-row',
        4
      );

      CommonQuoteTestUtilsService.expectNumberOfElementsPresent(
        expect,
        htmlElem,
        '.cx-ghost-summary-label',
        4
      );

      CommonQuoteTestUtilsService.expectNumberOfElementsPresent(
        expect,
        htmlElem,
        '.cx-ghost-summary-amount',
        4
      );
    });
  });
});
