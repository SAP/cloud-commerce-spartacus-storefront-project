import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { Currency, CurrencyService, I18nTestingModule } from '@spartacus/core';
import {
  B2BUnitNode,
  OrgUnitService,
} from '@spartacus/organization/administration/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { BehaviorSubject } from 'rxjs';
import { FormTestingModule } from '../../shared/form/form.testing.module';
import { BudgetItemService } from '../services/budget-item.service';
import { BudgetFormComponent } from './budget-form.component';

const mockForm = new FormGroup({
  name: new FormControl(),
  code: new FormControl(),
  startDate: new FormControl(),
  endDate: new FormControl(),
  currency: new FormGroup({
    isocode: new FormControl(),
  }),
  orgUnit: new FormGroup({
    uid: new FormControl(),
  }),
  budget: new FormControl(),
});

let activeUnitList$: BehaviorSubject<B2BUnitNode[]>;
let currencies$: BehaviorSubject<Currency[]>;

class MockOrgUnitService {
  getActiveUnitList = () => activeUnitList$.asObservable();
  loadList() {}
}

class MockCurrencyService {
  getAll = () => currencies$.asObservable();
}

class MockItemService {
  getForm() {
    return mockForm;
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cx-date-picker',
  template: '',
})
class MockDatePickerComponent {
  @Input() control: FormControl;
  @Input() min: FormControl;
  @Input() max: FormControl;
}

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;
  let currencyService: CurrencyService;
  let b2bUnitService: OrgUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        UrlTestingModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormTestingModule,
      ],
      declarations: [
        BudgetFormComponent,
        FormErrorsComponent,
        MockDatePickerComponent,
      ],
      providers: [
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: BudgetItemService, useClass: MockItemService },
      ],
    }).compileComponents();

    currencyService = TestBed.inject(CurrencyService);
    b2bUnitService = TestBed.inject(OrgUnitService);

    spyOn(currencyService, 'getAll').and.callThrough();
    spyOn(b2bUnitService, 'getActiveUnitList').and.callThrough();
    spyOn(b2bUnitService, 'loadList').and.callThrough();

    activeUnitList$ = new BehaviorSubject([]);
    currencies$ = new BehaviorSubject([]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form controls', () => {
    component.form = mockForm;
    fixture.detectChanges();
    const formControls = fixture.debugElement.queryAll(By.css('input'));
    expect(formControls.length).toBeGreaterThan(0);
  });

  it('should not render any form controls if the form is falsy', () => {
    component.form = undefined;
    fixture.detectChanges();
    const formControls = fixture.debugElement.queryAll(By.css('input'));
    expect(formControls.length).toBe(0);
  });

  it('should get currencies from service', () => {
    component.form = mockForm;
    expect(currencyService.getAll).toHaveBeenCalled();
  });

  it('should get active b2bUnits from service', () => {
    component.form = mockForm;
    expect(b2bUnitService.getActiveUnitList).toHaveBeenCalled();
  });

  it('should load list of b2bUnits on init', () => {
    component.form = mockForm;
    component.ngOnInit();
    fixture.detectChanges();
    expect(b2bUnitService.loadList).toHaveBeenCalled();
  });

  describe('autoSelect', () => {
    beforeEach(() => {
      activeUnitList$.next(null);
      currencies$.next(null);
    });
    it('should auto-select unit if only one is available', () => {
      activeUnitList$.next([{ id: 'test' }]);
      fixture.detectChanges();
      expect(component.form.get('orgUnit.uid').value).toEqual('test');
    });

    it('should auto-select currency if only one is available', () => {
      currencies$.next([{ isocode: 'test' }]);
      fixture.detectChanges();
      expect(component.form.get('currency.isocode').value).toEqual('test');
    });

    it('should not auto-select unit if more than one is available', () => {
      activeUnitList$.next([{ id: 'test' }, { id: 'test' }]);
      fixture.detectChanges();
      expect(component.form.get('orgUnit.uid').value).toBeNull();
    });

    it('should not auto-select currency if more than one is available', () => {
      currencies$.next([{ isocode: 'test' }, { isocode: 'test' }]);
      fixture.detectChanges();
      expect(component.form.get('currency.isocode').value).toBeNull();
    });
  });

  describe('createCodeWithName', () => {
    it('should set code field value if empty based on provided name value', () => {
      mockForm.get('name').patchValue('Unit Test Value');
      mockForm.get('code').patchValue(undefined);
      component.form = mockForm;
      component.createCodeWithName(
        component.form.get('name'),
        component.form.get('code')
      );

      expect(component.form.get('code').value).toEqual('unit-test-value');
    });
    it('should prevent setting code if value is provided for this field', () => {
      mockForm.get('name').patchValue('Unit Test Value');
      mockForm.get('code').patchValue('test code');
      component.form = mockForm;
      component.createCodeWithName(
        component.form.get('name'),
        component.form.get('code')
      );

      expect(component.form.get('code').value).toEqual('test code');
    });
  });
});
