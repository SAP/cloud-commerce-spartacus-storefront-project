import {
  Component,
  DebugElement,
  Directive,
  Input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { I18nTestingModule } from '@spartacus/core';
import {
  DirectionMode,
  DirectionService,
  FocusConfig,
  ICON_TYPE,
} from '@spartacus/storefront';
import { ArgsPipe } from '@spartacus/asm/core';
import { GeneralEntry } from '../../sections/asm-customer-activity/asm-customer-activity.model';

import { AsmCustomerTableComponent } from './asm-customer-table.component';
import { CustomerTableColumn, TableEntry } from './asm-customer-table.model';

@Directive({
  selector: '[cxFocus]',
})
export class MockKeyboadFocusDirective {
  @Input('cxFocus') config: FocusConfig = {};
}

describe('AsmCustomerTableComponent', () => {
  @Pipe({
    name: 'cxTranslate',
  })
  class MockTranslatePipe implements PipeTransform {
    transform(): any {}
  }
  @Component({
    selector: 'cx-icon',
    template: '',
  })
  class MockCxIconComponent {
    @Input() type: ICON_TYPE;
  }

  class MockDirectionService {
    getDirection() {
      return DirectionMode.LTR;
    }
  }

  const mockColumns: Array<CustomerTableColumn> = [
    {
      property: 'type',
      text: 'type',
    },
    { property: 'id', text: 'id' },
    {
      property: 'description',
      text: 'description',
    },
    {
      property: 'category',
      text: 'status',
    },
    {
      property: 'created',
      text: 'created',
      isDate: true,
    },
    {
      property: 'updated',
      text: 'updated',
      isDate: true,
    },
  ];
  const mockEntries: Array<GeneralEntry> = [
    {
      type: 'Ticket',
      id: '00000001',
      description: 'Thing not work good',
      created: new Date('2022-07-07T18:25:43+0000').getTime(),
      updated: new Date('2022-07-07T18:25:43+0000').getTime(),
      category: 'New',
    },
    {
      type: 'Cart',
      id: '00002001',
      description: 'Cart with 1 item',
      created: new Date('2022-07-01T18:25:43+0000').getTime(),
      updated: new Date('2022-07-02T18:25:43+0000').getTime(),
    },
    {
      type: 'Cart',
      id: '00002007',
      description: 'Cart with 0 items',
      created: new Date('2022-06-15T18:25:43+0000').getTime(),
      updated: new Date('2022-06-20T18:25:43+0000').getTime(),
    },
    {
      type: 'Saved Cart',
      id: '00002002',
      description: 'Cart with 2 items',
      created: new Date('2022-07-02T18:25:43+0000').getTime(),
      updated: new Date('2022-07-04T18:25:43+0000').getTime(),
    },
    {
      type: 'Saved Cart',
      id: '00002005',
      description: 'Cart with 3 items',
      created: new Date('2022-06-09T18:25:43+0000').getTime(),
      updated: new Date('2022-06-12T18:25:43+0000').getTime(),
    },
    {
      type: 'Saved Cart',
      id: '00002008',
      description: 'Cart with 4 items',
      created: new Date('2022-06-22T18:25:43+0000').getTime(),
      updated: new Date('2022-06-22T18:25:43+0000').getTime(),
    },
    {
      type: 'Order',
      id: '00002003',
      description: 'Cart with 1 item',
      created: new Date('2022-05-30T18:25:43+0000').getTime(),
      updated: new Date('2022-05-31T18:25:43+0000').getTime(),
      category: 'Draft',
    },
    {
      type: 'Order',
      id: '00002006',
      description: 'Cart with 2 items',
      created: new Date('2022-06-05T18:25:43+0000').getTime(),
      updated: new Date('2022-06-06T18:25:43+0000').getTime(),
      category: 'Completed',
    },
  ];

  const mockEmptyText = 'empty list';
  const mockHeaderText = 'Header Text';

  @Component({
    selector: 'cx-test-host',
    template: `
      <cx-asm-customer-table
        [columns]="columns"
        [emptyStateText]="emptyStateText"
        [entries]="entries"
        [headerText]="headerText"
        [pageSize]="pageSize"
        [sortProperty]="sortProperty"
        (selectItem)="itemSelected($event)"
      ></cx-asm-customer-table>
    `,
  })
  class TestHostComponent {
    @Input() columns: Array<CustomerTableColumn>;
    @Input() emptyStateText: string;
    @Input() entries: Array<TableEntry>;
    @Input() headerText: string;
    @Input() pageSize: number;
    @Input() sortProperty: keyof TableEntry;
    itemSelected(): void {}
  }

  let component: AsmCustomerTableComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        TestHostComponent,
        AsmCustomerTableComponent,
        MockTranslatePipe,
        MockCxIconComponent,
        ArgsPipe,
      ],
      providers: [
        {
          provide: DirectionService,
          useClass: MockDirectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    component = fixture.debugElement.query(
      By.directive(AsmCustomerTableComponent)
    ).componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display header text', () => {
    testHost.headerText = mockHeaderText;
    fixture.detectChanges();

    const header = el.query(By.css('.cx-asm-customer-table-heading-text'));
    expect(header.nativeElement.innerText).toBe(mockHeaderText);
  });

  it('should display table', () => {
    testHost.columns = mockColumns;
    testHost.pageSize = 5;
    testHost.emptyStateText = mockEmptyText;
    testHost.sortProperty = mockColumns[0].property;
    testHost.headerText = mockHeaderText;
    testHost.entries = mockEntries;
    fixture.detectChanges();

    const table = el.query(By.css('.cx-asm-customer-table'));
    expect(table).toBeTruthy();

    const tableHeaders = table.queryAll(By.css('th'));
    expect(tableHeaders.length).toBe(mockColumns.length);

    const tableBody = el.query(By.css('tbody'));

    const tableRows = tableBody.queryAll(By.css('tr'));
    expect(tableRows.length).toBe(component.pageSize);
  });

  describe('table pagination', () => {
    beforeEach(() => {
      testHost.columns = mockColumns;
      testHost.pageSize = 5;
      testHost.emptyStateText = mockEmptyText;
      testHost.sortProperty = mockColumns[0].property;
      testHost.headerText = mockHeaderText;
      testHost.entries = mockEntries;

      fixture.autoDetectChanges(true);
    });
    afterEach(() => {
      fixture.autoDetectChanges(false);
    });

    it('should display the list of pages', () => {
      const pages = el.queryAll(
        By.css(
          '.cx-asm-customer-table-heading-pages .cx-asm-customer-table-heading-page'
        )
      );
      expect(pages.length).toBe(component.entryPages.length);
    });

    it('should change the table to the selected page', () => {
      const pages = el.queryAll(
        By.css(
          '.cx-asm-customer-table-heading-pages .cx-asm-customer-table-heading-page'
        )
      );

      pages[1].nativeElement.click();

      const tableBody = el.query(By.css('.cx-asm-customer-table tbody'));
      const tableRows = tableBody.queryAll(By.css('tr'));
      expect(component.currentPageNumber).toBe(1);
      expect(tableRows.length).toBe(3);
    });
  });

  describe('table sort', () => {
    beforeEach(() => {
      testHost.columns = mockColumns;
      testHost.pageSize = 5;
      testHost.emptyStateText = mockEmptyText;
      testHost.sortProperty = mockColumns[0].property;
      testHost.headerText = mockHeaderText;
      testHost.entries = mockEntries;

      fixture.autoDetectChanges(true);
    });
    afterEach(() => {
      fixture.autoDetectChanges(false);
    });

    it('should display the column headers', () => {
      const headers = el.queryAll(By.css('.cx-asm-customer-table-header'));
      expect(headers.length).toBe(component.columns.length);
    });

    it('should sort when click a column header', () => {
      const tableRows = component.table.nativeElement.rows;
      const childElement = tableRows[0].cells[0].firstChild;

      expect(tableRows[1].cells[0].innerText).toBe('Cart');

      childElement.click();
      expect(tableRows[1].cells[0].innerText).toBe('Ticket');
    });
  });

  describe('table cell focus', () => {
    beforeEach(() => {
      testHost.columns = mockColumns;
      testHost.pageSize = 5;
      testHost.emptyStateText = mockEmptyText;
      testHost.sortProperty = mockColumns[0].property;
      testHost.headerText = mockHeaderText;
      testHost.entries = mockEntries;

      fixture.autoDetectChanges(true);
    });
    afterEach(() => {
      fixture.autoDetectChanges(false);
    });

    it('should change focus by key input', () => {
      let event = {
        code: 'ArrowRight',
        ctrlKey: false,
        stopPropagation: () => {},
        preventDefault: () => {},
      };

      const tableCell = component.table.nativeElement.rows[0].cells[0];
      const childElement = tableCell.firstChild;
      childElement.tabIndex = 0;
      childElement.focus();

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(0);

      event.code = 'ArrowRight';
      component.onKeyDownCell(event as KeyboardEvent, 0, 0);

      expect(component.focusedTableColumnIndex).toBe(1);
      expect(component.focusedTableRowIndex).toBe(0);

      event.code = 'ArrowLeft';
      component.onKeyDownCell(event as KeyboardEvent, 1, 0);

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(0);

      event.code = 'ArrowUp';
      component.onKeyDownCell(event as KeyboardEvent, 0, 0);

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(0);

      event.code = 'ArrowDown';
      component.onKeyDownCell(event as KeyboardEvent, 0, 0);

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(1);

      event.code = 'Home';
      component.onKeyDownCell(event as KeyboardEvent, 0, 1);

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(1);

      event.code = 'End';
      component.onKeyDownCell(event as KeyboardEvent, 0, 1);

      expect(component.focusedTableColumnIndex).toBe(mockColumns.length - 1);
      expect(component.focusedTableRowIndex).toBe(1);

      event.code = 'Home';
      event.ctrlKey = true;
      component.onKeyDownCell(event as KeyboardEvent, 1, 1);

      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(0);

      event.code = 'End';
      event.ctrlKey = true;
      component.onKeyDownCell(event as KeyboardEvent, 1, 1);

      expect(component.focusedTableColumnIndex).toBe(mockColumns.length - 1);
      expect(component.focusedTableRowIndex).toBe(5);

      expect(component.currentPageNumber).toBe(0);
      event.code = 'PageDown';
      component.onKeyDownCell(event as KeyboardEvent, 0, 1);
      fixture.detectChanges();

      expect(component.currentPageNumber).toBe(1);
      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(1);

      event.code = 'PageUp';
      component.onKeyDownCell(event as KeyboardEvent, 0, 1);
      fixture.detectChanges();

      expect(component.currentPageNumber).toBe(0);
      expect(component.focusedTableColumnIndex).toBe(0);
      expect(component.focusedTableRowIndex).toBe(1);
    });
  });
});
