import { inject, TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';
import { ActiveCartFacade, MultiCartFacade } from '@spartacus/cart/base/root';
import {
  Comment,
  Quote,
  QuoteActionType,
  QuoteCartService,
  QuoteDetailsReloadQueryEvent,
  QuoteDiscount,
  QuoteDiscountType,
  QuoteList,
  QuoteMetadata,
  QuotesStateParams,
} from '@spartacus/quote/root';
import {
  EventService,
  GlobalMessageService,
  OCC_USER_ID_CURRENT,
  PaginationModel,
  QueryState,
  RouterState,
  RoutingService,
  UserIdService,
} from '@spartacus/core';
import { ViewConfig } from '@spartacus/storefront';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { QuoteConnector } from '../connectors';
import { QuoteService } from './quote.service';
import { createEmptyQuote, QUOTE_CODE } from '../testing/quote-test-utils';
import createSpy = jasmine.createSpy;
import { CartUtilsService } from '../services/cart-utils.service';

const mockUserId = OCC_USER_ID_CURRENT;
const mockCartId = '1234';
const mockAction = { type: QuoteActionType.EDIT, isPrimary: true };
const mockCurrentPage = 0;
const mockSort = 'byCode';
const mockPagination: PaginationModel = {
  currentPage: mockCurrentPage,
  pageSize: 5,
  sort: mockSort,
};
const mockQuote: Quote = {
  ...createEmptyQuote(),
  allowedActions: [mockAction],
  cartId: mockCartId,
  code: '333333',
};
const mockQuoteList: QuoteList = {
  pagination: mockPagination,
  sorts: [{ code: 'byDate' }],
  quotes: [mockQuote],
};
const mockParams = { ['quoteId']: '1' };
const mockRouterState$ = new BehaviorSubject({
  navigationId: 1,
  state: { params: mockParams as Params },
});
const mockMetadata: QuoteMetadata = {
  name: 'test',
  description: 'test desc',
};
const mockComment: Comment = {
  text: 'test comment',
};
const mockQuotesStateParams: QuotesStateParams = {
  sort$: of(mockSort),
  currentPage$: of(mockCurrentPage),
};

class MockRoutingService implements Partial<RoutingService> {
  getRouterState() {
    return mockRouterState$.asObservable() as Observable<RouterState>;
  }
  go = createSpy();
}

class MockUserIdService implements Partial<UserIdService> {
  takeUserId = createSpy().and.returnValue(of(mockUserId));
}

class MockEventService implements Partial<EventService> {
  get = createSpy().and.returnValue(of());
  dispatch = createSpy();
}

let isQuoteCartActive: any;
let quoteId: any;
class MockQuoteCartService {
  setQuoteCartActive = createSpy();
  setQuoteId = createSpy();
  setCheckoutAllowed = createSpy();
  isQuoteCartActive() {
    return of(isQuoteCartActive);
  }
  getQuoteId() {
    return of(quoteId);
  }
}
class MockViewConfig implements ViewConfig {
  view = { defaultPageSize: mockPagination.pageSize };
}

class MockCommerceQuotesConnector implements Partial<QuoteConnector> {
  getQuotes = createSpy().and.returnValue(of(mockQuoteList));
  getQuote = createSpy().and.returnValue(of(mockQuote));
  createQuote = createSpy().and.returnValue(of(mockQuote));
  editQuote = createSpy().and.returnValue(of(EMPTY));
  addComment = createSpy().and.returnValue(of(EMPTY));
  addCartEntryComment = createSpy().and.returnValue(of(EMPTY));
  performQuoteAction = createSpy().and.returnValue(of(EMPTY));
  addDiscount = createSpy().and.returnValue(of(EMPTY));
}

class MockActiveCartService implements Partial<ActiveCartFacade> {
  reloadActiveCart = createSpy().and.stub();
  takeActiveCartId = createSpy().and.returnValue(of(mockCartId));
}

class MockMultiCartFacade implements Partial<MultiCartFacade> {
  loadCart = createSpy();
  createCart = createSpy().and.returnValue(of({}));
}

class MockCartUtilsService implements Partial<CartUtilsService> {
  createNewCartAndGoToQuoteList = createSpy();
}

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  remove() {}
  add() {}
}

describe('QuoteService', () => {
  let service: QuoteService;
  let connector: QuoteConnector;
  let eventService: EventService;
  let config: ViewConfig;
  let multiCartFacade: MultiCartFacade;
  let routingService: RoutingService;
  let quoteCartService: QuoteCartService;
  let cartUtilsService: CartUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuoteService,
        { provide: UserIdService, useClass: MockUserIdService },
        { provide: EventService, useClass: MockEventService },
        { provide: ViewConfig, useClass: MockViewConfig },
        {
          provide: QuoteConnector,
          useClass: MockCommerceQuotesConnector,
        },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: ActiveCartFacade, useClass: MockActiveCartService },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        { provide: MultiCartFacade, useClass: MockMultiCartFacade },
        { provide: QuoteCartService, useClass: MockQuoteCartService },
        { provide: CartUtilsService, useClass: MockCartUtilsService },
      ],
    });

    service = TestBed.inject(QuoteService);
    connector = TestBed.inject(QuoteConnector);
    eventService = TestBed.inject(EventService);
    config = TestBed.inject(ViewConfig);
    multiCartFacade = TestBed.inject(MultiCartFacade);
    routingService = TestBed.inject(RoutingService);
    quoteCartService = TestBed.inject(QuoteCartService);
    cartUtilsService = TestBed.inject(CartUtilsService);

    isQuoteCartActive = false;
    quoteId = '';
  });

  it('should inject CommerceQuotesService', inject(
    [QuoteService],
    (quoteService: QuoteService) => {
      expect(quoteService).toBeTruthy();
    }
  ));

  it('should return quotes after calling quoteConnector.getQuotes', () => {
    service
      .getQuotesState(mockQuotesStateParams)
      .pipe(take(1))
      .subscribe((state) => {
        expect(connector.getQuotes).toHaveBeenCalledWith(
          mockUserId,
          mockPagination
        );
        expect(state).toEqual(<QueryState<QuoteList | undefined>>{
          loading: false,
          error: false,
          data: mockQuoteList,
        });
      });
  });

  it('should return quotes after calling quoteConnector.getQuotes with default CMS page size if not set', () => {
    //given
    config.view = undefined;

    //then
    service
      .getQuotesState(mockQuotesStateParams)
      .pipe(take(1))
      .subscribe((state) => {
        expect(connector.getQuotes).toHaveBeenCalledWith(mockUserId, {
          ...mockPagination,
          pageSize: undefined,
        });
        expect(state).toEqual(<QueryState<QuoteList | undefined>>{
          loading: false,
          error: false,
          data: mockQuoteList,
        });
      });
  });

  it('should signal that quote details need to be re-read when performing search', () => {
    service
      .getQuotesState(mockQuotesStateParams)
      .pipe(take(1))
      .subscribe(() => {
        expect(eventService.dispatch).toHaveBeenCalledWith(
          {},
          QuoteDetailsReloadQueryEvent
        );
      });
  });

  it('should return quote details query state after calling quoteConnector.getQuote', () => {
    service
      .getQuoteDetailsQueryState()
      .pipe(take(1))
      .subscribe((details) => {
        expect(connector.getQuote).toHaveBeenCalledWith(
          mockUserId,
          mockParams.quoteId
        );
        expect(details.data).toEqual(mockQuote);
        expect(details.loading).toBe(false);
      });
  });

  describe('getQuoteDetails', () => {
    it('should return quote details after calling quoteConnector.getQuote', () => {
      service
        .getQuoteDetails()
        .pipe(take(1))
        .subscribe((details) => {
          expect(connector.getQuote).toHaveBeenCalledWith(
            mockUserId,
            mockParams.quoteId
          );
          expect(details).toEqual(mockQuote);
        });
    });

    it('should load quote cart in quote is linked to current quote cart', (done) => {
      isQuoteCartActive = true;
      quoteId = mockQuote.code;
      service
        .getQuoteDetails()
        .pipe(take(1))
        .subscribe((details) => {
          expect(multiCartFacade.loadCart).toHaveBeenCalledWith({
            userId: mockUserId,
            cartId: mockQuote.cartId,
            extraData: {
              active: true,
            },
          });
          expect(details).toEqual(mockQuote);
          done();
        });
    });
  });

  describe('addDiscount', () => {
    const discount: QuoteDiscount = {
      discountRate: 1,
      discountType: QuoteDiscountType.ABSOLUTE,
    };
    it('should ', () => {
      service
        .addDiscount(QUOTE_CODE, discount)
        .pipe(take(1))
        .subscribe(() => {
          expect(connector.addDiscount).toHaveBeenCalledWith(
            mockUserId,
            QUOTE_CODE,
            discount
          );
        });
    });
  });

  it('should call createQuote command', () => {
    service
      .createQuote(mockMetadata)
      .pipe(take(1))
      .subscribe((quote) => {
        expect(connector.createQuote).toHaveBeenCalled();
        expect(quote.code).toEqual(mockQuote.code);
        expect(connector.editQuote).toHaveBeenCalled();
        expect(multiCartFacade.loadCart).toHaveBeenCalled();
        expect(eventService.dispatch).toHaveBeenCalled();
      });
  });

  it('should call editQuote command', () => {
    service
      .editQuote(mockQuote.code, mockMetadata)
      .pipe(take(1))
      .subscribe(() => {
        expect(connector.editQuote).toHaveBeenCalledWith(
          mockUserId,
          mockQuote.code,
          mockMetadata
        );
      });
  });

  it('should call addQuoteComment command', () => {
    service
      .addQuoteComment(mockQuote.code, mockComment)
      .pipe(take(1))
      .subscribe(() => {
        expect(connector.addComment).toHaveBeenCalledWith(
          mockUserId,
          mockQuote.code,
          mockComment
        );
      });
  });

  describe('performQuoteAction', () => {
    it('should call respective connector method', (done) => {
      service
        .performQuoteAction(mockQuote.code, mockAction.type)
        .subscribe(() => {
          expect(connector.performQuoteAction).toHaveBeenCalledWith(
            mockUserId,
            mockQuote.code,
            mockAction.type
          );
          done();
        });
    });

    it('should raise re-load event', (done) => {
      service
        .performQuoteAction(mockQuote.code, mockAction.type)
        .subscribe(() => {
          expect(eventService.dispatch).toHaveBeenCalledWith(
            {},
            QuoteDetailsReloadQueryEvent
          );
          done();
        });
    });

    it('should reset cart quote mode on submit, create new cart and navigate to quote list', (done) => {
      service
        .performQuoteAction(mockQuote.code, QuoteActionType.SUBMIT)
        .subscribe(() => {
          expect(quoteCartService.setQuoteCartActive).toHaveBeenCalledWith(
            false
          );
          expect(
            cartUtilsService.createNewCartAndGoToQuoteList
          ).toHaveBeenCalled();
          done();
        });
    });

    it('should reset cart quote mode on cancel, create new cart and navigate to quote list', (done) => {
      service
        .performQuoteAction(mockQuote.code, QuoteActionType.CANCEL)
        .subscribe(() => {
          expect(quoteCartService.setQuoteCartActive).toHaveBeenCalledWith(
            false
          );
          expect(
            cartUtilsService.createNewCartAndGoToQuoteList
          ).toHaveBeenCalled();
          done();
        });
    });

    it('should set cart quote mode on edit', (done) => {
      service
        .performQuoteAction(mockQuote.code, QuoteActionType.EDIT)
        .subscribe(() => {
          expect(quoteCartService.setQuoteCartActive).toHaveBeenCalledWith(
            true
          );
          expect(quoteCartService.setQuoteId).toHaveBeenCalledWith(
            mockQuote.code
          );
          done();
        });
    });

    it('should set cart quote mode on checkout and signal that checkout is allowed', (done) => {
      service
        .performQuoteAction(mockQuote.code, QuoteActionType.CHECKOUT)
        .subscribe(() => {
          expect(quoteCartService.setQuoteCartActive).toHaveBeenCalledWith(
            true
          );
          expect(quoteCartService.setQuoteId).toHaveBeenCalledWith(
            mockQuote.code
          );
          expect(quoteCartService.setCheckoutAllowed).toHaveBeenCalledWith(
            true
          );
          done();
        });
    });
  });

  it('should call addQuoteComment command when called with empty string of an entry number', () => {
    service
      .addQuoteComment(mockQuote.code, mockComment, '')
      .pipe(take(1))
      .subscribe(() => {
        expect(connector.addComment).toHaveBeenCalledWith(
          mockUserId,
          mockQuote.code,
          mockComment
        );
      });
  });

  it('should call addCartEntryComment command when an entry number is provided', () => {
    service
      .addQuoteComment(mockQuote.code, mockComment, '0')
      .pipe(take(1))
      .subscribe(() => {
        expect(connector.addCartEntryComment).toHaveBeenCalledWith(
          mockUserId,
          mockQuote.code,
          '0',
          mockComment
        );
      });
  });

  it('should call requote command and return new quote', () => {
    service
      .requote(mockQuote.code)
      .pipe(take(1))
      .subscribe((quote) => {
        expect(connector.createQuote).toHaveBeenCalledWith(mockUserId, {
          quoteCode: mockQuote.code,
        });
        expect(routingService.go).toHaveBeenCalledWith({
          cxRoute: 'quoteDetails',
          params: { quoteId: quote.code },
        });
        expect(quote.code).toEqual(mockQuote.code);
      });
  });
});
