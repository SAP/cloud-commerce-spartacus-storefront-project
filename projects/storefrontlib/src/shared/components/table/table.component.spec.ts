import { Directive, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule } from '@spartacus/core';
import { TableComponent } from './table.component';
import { Table, TableHeader } from './table.model';
import { of } from 'rxjs';

@Directive({
  selector: '[cxOutlet]',
})
class MockAttributesDirective {
  @Input() cxOutlet: string;
  @Input() cxOutletContext: any;
}

const mockDataset: Table = {
  structure: {
    type: 'test-1',
    headers: [],
  },
  data$: of([]),
};

const headers: TableHeader[] = [
  { key: 'key1', sortCode: 'sort1' },
  { key: 'key2', sortCode: 'sort2' },
  { key: 'key3' },
];

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableComponent>;
  let tableComponent: TableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [TableComponent, MockAttributesDirective],
    })
      .overrideComponent(TableComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    tableComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(tableComponent).toBeTruthy();
  });

  it('should not render a table if there is no dataset', () => {
    tableComponent.dataset = undefined;
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeNull();
  });

  it('should not render a table if there is no dataset.structure', () => {
    tableComponent.dataset = {} as Table;
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeNull();
  });

  it('should render table', () => {
    tableComponent.dataset = mockDataset;
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.css('table'));
    expect(table.nativeElement).toBeTruthy();
  });

  it('should add the dataset.structure.type to cx-table element in devMode', () => {
    tableComponent.dataset = mockDataset;
    expect(tableComponent.tableType).toEqual('test-1');
  });

  describe('table header', () => {
    it('should not add the thead when hideHeader = true', () => {
      tableComponent.dataset = {
        ...mockDataset,
        structure: { ...mockDataset.structure, hideHeader: true },
      };
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table thead'));
      expect(table).toBeNull();
    });

    it('should add a th for each tableHeader ', () => {
      tableComponent.dataset = {
        ...mockDataset,
        structure: {
          ...mockDataset.structure,
          headers,
        },
      };
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table thead'));
      expect(table.nativeElement).toBeTruthy();
      const th = fixture.debugElement.queryAll(By.css('table thead tr th'));
      expect(th[0].nativeElement).toBeTruthy();
      expect(th[1].nativeElement).toBeTruthy();
      expect(th[2].nativeElement).toBeTruthy();
    });

    it('should add the header.label in the th if available ', () => {
      // TODO
    });

    it('should leverage the translate pipe for the header key when there is no header label', () => {
      // TODO
    });

    it('should render custom outlet template in the th', () => {
      // TODO
    });
  });

  describe('table data', () => {
    it('should generate a tr for each data row', () => {
      // TODO
    });

    it('should generate a tr for each data row', () => {
      // TODO
    });

    it('should render custom outlet template in the td', () => {
      // TODO
    });
  });
});
