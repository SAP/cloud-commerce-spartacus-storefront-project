import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { OutletContextData } from '@spartacus/storefront';
import { of } from 'rxjs';
import { TableHeaderOutletContext, TableOptions } from '../table.model';
import { TableHeaderCellComponent } from './table-header-cell.component';

const mockOptions: TableOptions = {
  cells: {
    name1: {
      label: 'static name',
    },
    name2: {},
    name3: {
      label: { i18nKey: 'custom.prop.name2' },
    },
  },
};

describe('TableHeaderCellComponent', () => {
  let component: TableHeaderCellComponent;
  let fixture: ComponentFixture<TableHeaderCellComponent>;

  describe('static field', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TableHeaderCellComponent],
        imports: [I18nTestingModule],
        providers: [
          {
            provide: OutletContextData,
            useValue: {
              context$: of({
                _type: 'table',
                _field: 'name1',
                _options: mockOptions,
              } as TableHeaderOutletContext),
            },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TableHeaderCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should resolve static header', () => {
      let header: string | null | undefined;
      component.header.subscribe((data) => (header = data)).unsubscribe();
      expect(header).toEqual('static name');
    });
  });

  describe('i18n default', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TableHeaderCellComponent],
        imports: [I18nTestingModule],
        providers: [
          {
            provide: OutletContextData,
            useValue: {
              context$: of({
                _type: 'table',
                _field: 'name2',
                _i18nRoot: 'i18nRoot',
                _options: mockOptions,
              } as TableHeaderOutletContext),
            },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TableHeaderCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should resolve static header', () => {
      let localizedHeader: string | undefined;
      component.localizedHeader
        .subscribe((data) => (localizedHeader = data))
        .unsubscribe();
      expect(localizedHeader).toEqual('i18nRoot.name2');
    });
  });

  describe('i18n field', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TableHeaderCellComponent],
        imports: [I18nTestingModule],
        providers: [
          {
            provide: OutletContextData,
            useValue: {
              context$: of({
                _type: 'table',
                _field: 'name3',
                _options: mockOptions,
              } as TableHeaderOutletContext),
            },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TableHeaderCellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should resolve static header', () => {
      let localizedHeader: string | undefined;
      component.localizedHeader
        .subscribe((data) => (localizedHeader = data))
        .unsubscribe();
      expect(localizedHeader).toEqual('custom.prop.name2');
    });
  });
});
