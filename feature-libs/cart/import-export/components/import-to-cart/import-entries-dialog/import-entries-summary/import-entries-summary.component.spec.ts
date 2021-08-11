import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductImportSummary } from '@spartacus/cart/import-export/core';
import { I18nTestingModule } from '@spartacus/core';
import { ImportEntriesSummaryComponent } from './import-entries-summary.component';

const mockSummary: ProductImportSummary = {
  loading: true,
  cartName: 'mockCart',
  count: 0,
  total: 2,
  successesCount: 2,
  warningMessages: [],
  errorMessages: [],
};

describe('ImportEntriesFormComponent', () => {
  let component: ImportEntriesSummaryComponent;
  let fixture: ComponentFixture<ImportEntriesSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [ImportEntriesSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportEntriesSummaryComponent);
    component = fixture.componentInstance;
    component.summary = mockSummary;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on close method', () => {
    spyOn(component.closeEvent, 'emit');
    const mockCloseReason = 'Close Import Products Dialog';
    component.close(mockCloseReason);

    expect(component.closeEvent.emit).toHaveBeenCalledWith(mockCloseReason);
  });
});
