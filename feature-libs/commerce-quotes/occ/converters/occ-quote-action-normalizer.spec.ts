import { inject, TestBed } from '@angular/core/testing';
import { CQConfig } from '@spartacus/commerce-quotes/core';
import {
  OccQuote,
  Quote,
  QuoteActionsByState,
  QuoteActionType,
  QuoteState,
} from '@spartacus/commerce-quotes/root';
import { OccQuoteActionNormalizer } from './occ-quote-action-normalizer';

const mockActionOrderByState: Partial<QuoteActionsByState> = {
  BUYER_DRAFT: [QuoteActionType.CANCEL, QuoteActionType.SUBMIT],
};
const mockPrimaryAction = QuoteActionType.SUBMIT;
const mockState = QuoteState.BUYER_DRAFT;
const mockAllowedActions = [QuoteActionType.SUBMIT, QuoteActionType.CANCEL];

const mockQuote: OccQuote = {
  allowedActions: mockAllowedActions,
  state: mockState,
  code: '1234',
};

const mockConvertedQuote: Quote = {
  ...mockQuote,
  allowedActions: [
    { type: QuoteActionType.CANCEL, isPrimary: false },
    { type: QuoteActionType.SUBMIT, isPrimary: true },
  ],
};

const MockCQConfig: Partial<CQConfig> = {
  commerceQuotes: {
    actions: {
      actionsOrderByState: mockActionOrderByState,
      primaryActions: [mockPrimaryAction],
    },
  },
};

describe('BudgetNormalizer', () => {
  let service: OccQuoteActionNormalizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccQuoteActionNormalizer,
        { provide: CQConfig, useValue: MockCQConfig },
      ],
    });

    service = TestBed.inject(OccQuoteActionNormalizer);
  });

  it('should inject OccQuoteActionNormalizer', inject(
    [OccQuoteActionNormalizer],
    (budgetNormalizer: OccQuoteActionNormalizer) => {
      expect(budgetNormalizer).toBeTruthy();
    }
  ));

  it('should convert budget', () => {
    const result = service.convert(mockQuote);
    expect(result).toEqual(mockConvertedQuote);
  });

  it('should return unsorted list if order is not present', () => {
    service['commerceQuotesConfig'] = {
      commerceQuotes: undefined,
    };
    expect(service['getOrderedActions'](mockState, mockAllowedActions)).toEqual(
      mockAllowedActions
    );

    service['commerceQuotesConfig'] = {
      commerceQuotes: {
        actions: undefined,
      },
    };
    expect(service['getOrderedActions'](mockState, mockAllowedActions)).toEqual(
      mockAllowedActions
    );

    service['commerceQuotesConfig'] = {
      commerceQuotes: {
        actions: {
          actionsOrderByState: undefined,
        },
      },
    };
    expect(service['getOrderedActions'](mockState, mockAllowedActions)).toEqual(
      mockAllowedActions
    );
  });

  it('should set isPrimary to false if primaryActions config is not defined', () => {
    const result = { type: mockAllowedActions[0], isPrimary: false };

    service['commerceQuotesConfig'] = {
      commerceQuotes: undefined,
    };
    expect(service['getActionCategory'](mockAllowedActions[0])).toEqual(result);

    service['commerceQuotesConfig'] = {
      commerceQuotes: {
        actions: undefined,
      },
    };
    expect(service['getActionCategory'](mockAllowedActions[0])).toEqual(result);

    service['commerceQuotesConfig'] = {
      commerceQuotes: {
        actions: {
          primaryActions: undefined,
        },
      },
    };
    expect(service['getActionCategory'](mockAllowedActions[0])).toEqual(result);
  });
});
