import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Quote,
  QuoteAction,
  QuoteState,
} from '@spartacus/commerce-quotes/root';
import {
  Config,
  ConfigurationService,
  I18nTestingModule,
  QueryState,
  TranslationService,
} from '@spartacus/core';
import { CommerceQuotesFacade } from 'feature-libs/commerce-quotes/root/facade/commerce-quotes.facade';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommerceQuotesActionsByRoleComponent } from './commerce-quotes-actions-by-role.component';
import createSpy = jasmine.createSpy;

const mockCartId = '1234';
const mockCode = '3333';
const mockQuote: Quote = {
  allowedActions: [QuoteAction.EDIT, QuoteAction.REQUOTE],
  state: QuoteState.BUYER_DRAFT,
  cartId: mockCartId,
  code: mockCode,
};
const mockQuoteDetailsState: QueryState<Quote> = {
  loading: false,
  error: false,
  data: mockQuote,
};
const mockQuoteActionsOrderByState = [QuoteAction.REQUOTE, QuoteAction.EDIT];

const mockQuoteDetailsState$ = new BehaviorSubject<QueryState<Quote>>(
  mockQuoteDetailsState
);
class MockCommerceQuotesFacade implements Partial<CommerceQuotesFacade> {
  getQuoteDetails(): Observable<QueryState<Quote>> {
    return mockQuoteDetailsState$.asObservable();
  }
  performQuoteAction = createSpy();
  requote = createSpy();
}

class MockTranslationService implements Partial<TranslationService> {
  translate(key: string): Observable<string> {
    return of(key);
  }
}

class MockConfigurationService implements Partial<ConfigurationService> {
  config = {
    commerceQuotes: {
      actionsOrderByState: {
        [QuoteState.BUYER_DRAFT]: [...mockQuoteActionsOrderByState],
      },
    },
  } as Config;
}

describe('CommerceQuotesActionsByRoleComponent', () => {
  let fixture: ComponentFixture<CommerceQuotesActionsByRoleComponent>;
  let component: CommerceQuotesActionsByRoleComponent;

  let facade: CommerceQuotesFacade;
  let configService: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [CommerceQuotesActionsByRoleComponent],
      providers: [
        {
          provide: CommerceQuotesFacade,
          useClass: MockCommerceQuotesFacade,
        },
        { provide: TranslationService, useClass: MockTranslationService },
        { provide: ConfigurationService, useClass: MockConfigurationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceQuotesActionsByRoleComponent);
    component = fixture.componentInstance;

    facade = TestBed.inject(CommerceQuotesFacade);
    configService = TestBed.inject(ConfigurationService);
    mockQuoteDetailsState$.next(mockQuoteDetailsState);
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(facade).toBeDefined();
  });

  it('should read quote details and change order of allowedActions', (done) => {
    const expected = {
      ...mockQuoteDetailsState,
      data: { ...mockQuote, allowedActions: mockQuoteActionsOrderByState },
    };

    component.quoteDetailsState$.pipe(take(1)).subscribe((state) => {
      expect(state).toEqual(expected);
      done();
    });
  });

  it('should read quote details and return original data if state or allower actions are not present', (done) => {
    const mockQuoteDetailseWithoutState: Quote = {
      code: mockCode,
      cartId: mockCartId,
      allowedActions: [QuoteAction.EDIT, QuoteAction.REQUOTE],
    };
    const expected: QueryState<Quote> = {
      error: false,
      loading: false,
      data: mockQuoteDetailseWithoutState,
    };
    mockQuoteDetailsState$.next(expected);

    component.quoteDetailsState$.pipe(take(1)).subscribe((state) => {
      expect(state).toEqual(expected);
      done();
    });
  });

  it('should return list if commerce quotes config or actions order is not present', () => {
    Object.defineProperty(configService, 'config', {
      value: {
        commerceQuotes: null,
      },
    });
    expect(
      component['getOrderedList'](
        QuoteState.BUYER_DRAFT,
        mockQuote.allowedActions as QuoteAction[]
      )
    ).toEqual(mockQuote.allowedActions);

    Object.defineProperty(configService, 'config', {
      value: {
        commerceQuotes: { actionsOrderByState: null },
      },
    });
    expect(
      component['getOrderedList'](
        QuoteState.BUYER_DRAFT,
        mockQuote.allowedActions as QuoteAction[]
      )
    ).toEqual(mockQuote.allowedActions);
  });

  it('should return empty array if commerce quotes config is not set', () => {
    Object.defineProperty(configService, 'config', {
      value: {
        commerceQuotes: null,
      },
    });
    fixture = TestBed.createComponent(CommerceQuotesActionsByRoleComponent);
    component = fixture.componentInstance;

    expect(component.primaryActions).toEqual([]);
  });

  it('should generate buttons with actions and trigger proper method (requote if allowed action is REQUOTE)', () => {
    fixture.detectChanges();
    const actionButtons = fixture.debugElement.queryAll(By.css('.btn'));

    expect(actionButtons).toBeDefined();
    actionButtons.filter((button, idx) => {
      expect(button.nativeElement.textContent.trim()).toEqual(
        `commerceQuotes.actions.${mockQuoteActionsOrderByState[idx]}`
      );
      button.nativeElement.click();
    });
    expect(facade.performQuoteAction).toHaveBeenCalledWith(
      mockQuote.code,
      QuoteAction.EDIT
    );
    expect(facade.requote).toHaveBeenCalledWith(mockQuote.code);
  });
});
