import {
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Quote,
  QuoteActionType,
  QuoteList,
  QuoteState,
} from '@spartacus/commerce-quotes/root';
import {
  I18nTestingModule,
  PaginationModel,
  QueryState,
  SortModel,
} from '@spartacus/core';
import { BehaviorSubject, of } from 'rxjs';
import { CommerceQuotesListComponentService } from './commerce-quotes-list-component.service';
import { CommerceQuotesListComponent } from './commerce-quotes-list.component';
import createSpy = jasmine.createSpy;

const mockCartId = '1234';
const mockPagination: PaginationModel = {
  currentPage: 0,
  pageSize: 5,
  sort: 'byCode',
};
const mockAction = { type: QuoteActionType.EDIT, isPrimary: true };
const mockQuote: Quote = {
  allowedActions: [mockAction],
  cartId: mockCartId,
  code: '333333',
};
const mockQuoteList: QuoteList = {
  pagination: mockPagination,
  quotes: [mockQuote],
};
const mockQuoteListState: QueryState<QuoteList> = {
  loading: false,
  error: false,
  data: mockQuoteList,
};
const mockSorts = [
  { code: 'byDate' },
  { code: 'byCode' },
  { code: 'byName' },
  { code: 'byState' },
];
const mockQuoteListState$ = new BehaviorSubject(mockQuoteListState);

@Component({
  template: '',
  selector: 'cx-pagination',
})
class MockPaginationComponent {
  @Input() pagination: PaginationModel;
  @Output() viewPageEvent = new EventEmitter();
}

@Component({
  template: '',
  selector: 'cx-sorting',
})
class MockSortingComponent {
  @Input() sortOptions: SortModel[];
  @Input() sortLabels: { [key: string]: string }[];
  @Input() selectedOption: string;
  @Input() placeholder: string;
  @Output() sortListEvent = new EventEmitter();
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockCommerceQuotesListComponentService
  implements Partial<CommerceQuotesListComponentService>
{
  sorts?: SortModel[] | undefined = mockSorts;
  sortLabels$ = of({
    byDate: 'sorting.date',
    byCode: 'sorting.quoteId',
    byName: 'sorting.name',
    byState: 'sorting.status',
  });
  quotesState$ = mockQuoteListState$.asObservable();
  sort = new BehaviorSubject('byCode');
  currentPage = new BehaviorSubject(0);
  setSort = createSpy();
  setCurrentPage = createSpy();
}

describe('CommerceQuotesListComponent', () => {
  let fixture: ComponentFixture<CommerceQuotesListComponent>;
  let component: CommerceQuotesListComponent;
  let componentService: CommerceQuotesListComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        CommerceQuotesListComponent,
        MockUrlPipe,
        MockPaginationComponent,
        MockSortingComponent,
      ],
      providers: [
        {
          provide: CommerceQuotesListComponentService,
          useClass: MockCommerceQuotesListComponentService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceQuotesListComponent);
    component = fixture.componentInstance;

    componentService = TestBed.inject(CommerceQuotesListComponentService);
  });

  it('should call service if sort changed', () => {
    //given
    const sortCode = 'byDate';

    //when
    component.changeSortCode(sortCode);

    //then
    expect(componentService.setSort).toHaveBeenCalledWith(sortCode);
  });

  it('should call service if page changed', () => {
    //given
    const page = 5;

    //when
    component.changePage(page);

    //then
    expect(componentService.setCurrentPage).toHaveBeenCalledWith(page);
  });

  it('should display table and sorting if quote list is not empty', () => {
    //given
    mockQuoteListState$.next(mockQuoteListState);

    //when
    fixture.detectChanges();
    const sorting = fixture.debugElement.query(By.css('cx-sorting'));
    const table = fixture.debugElement.query(By.css('#commerce-quotes-list'));

    //then
    expect(sorting.nativeElement).not.toBeNull();
    expect(table.nativeElement).not.toBeNull();
  });

  it('should display "empty list" header if quote list is empty', () => {
    //given
    mockQuoteListState$.next({
      ...mockQuoteListState,
      data: { ...mockQuoteList, quotes: [] },
    });

    //when
    fixture.detectChanges();
    const header = fixture.debugElement.query(
      By.css('.cx-commerce-quotes-list-empty')
    );

    //then
    expect(header.nativeElement.textContent.trim()).toEqual(
      'commerceQuotes.list.empty'
    );
  });

  it('should display pagination if pages total is more than 1', () => {
    //given
    mockQuoteListState$.next({
      ...mockQuoteListState,
      data: {
        ...mockQuoteList,
        pagination: { ...mockPagination, totalPages: 2 },
      },
    });

    //when
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('cx-pagination'));

    //then
    expect(elements.length).toEqual(1);
  });

  describe('getQuoteStateClass', () => {
    it('should apply quote-draft class', () => {
      //given
      mockQuoteListState$.next({
        ...mockQuoteListState,
        data: {
          ...mockQuoteList,
          quotes: [{ ...mockQuote, state: QuoteState.BUYER_DRAFT }],
        },
      });
      //when
      fixture.detectChanges();
      //then
      const quoteStateLink = fixture.debugElement.query(
        By.css('.cx-commerce-quotes-list-quote-status a')
      ).attributes.class;
      expect(quoteStateLink).toContain('quote-draft');
    });
    it('should apply quote-submitted class', () => {
      //given
      mockQuoteListState$.next({
        ...mockQuoteListState,
        data: {
          ...mockQuoteList,
          quotes: [{ ...mockQuote, state: QuoteState.BUYER_SUBMITTED }],
        },
      });
      //when
      fixture.detectChanges();

      //then
      const quoteStateLink = fixture.debugElement.query(
        By.css('.cx-commerce-quotes-list-quote-status a')
      ).attributes.class;

      expect(quoteStateLink).toContain('quote-submitted');
    });
    it('should apply quote-rejected class', () => {
      //given
      mockQuoteListState$.next({
        ...mockQuoteListState,
        data: {
          ...mockQuoteList,
          quotes: [{ ...mockQuote, state: QuoteState.BUYER_REJECTED }],
        },
      });
      //when
      fixture.detectChanges();
      const quoteStateLink = fixture.debugElement.query(
        By.css('.cx-commerce-quotes-list-quote-status a')
      ).attributes.class;

      expect(quoteStateLink).toContain('quote-rejected');
    });
    it('should apply quote-cancelled class', () => {
      //given
      mockQuoteListState$.next({
        ...mockQuoteListState,
        data: {
          ...mockQuoteList,
          quotes: [{ ...mockQuote, state: QuoteState.CANCELLED }],
        },
      });
      //when
      fixture.detectChanges();

      //then
      const quoteStateLink = fixture.debugElement.query(
        By.css('.cx-commerce-quotes-list-quote-status a')
      ).attributes.class;

      expect(quoteStateLink).toContain('quote-cancelled');
    });
  });
});
