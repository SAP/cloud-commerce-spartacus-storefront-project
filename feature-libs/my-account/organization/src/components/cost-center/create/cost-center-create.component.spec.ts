import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  RoutingService,
  UrlTestingModule,
} from '@spartacus/core';
import { of } from 'rxjs';
import { CostCenterCreateComponent } from './cost-center-create.component';
import { CostCenterFormService } from '../form/cost-center-form.service';
import { CostCenterService } from '../../../core/services/cost-center.service';

import createSpy = jasmine.createSpy;
import { SplitViewTestingModule } from '@spartacus/storefront';
import { IconTestingModule } from 'projects/storefrontlib/src/cms-components/misc/icon/testing/icon-testing.module';

@Component({
  selector: 'cx-cost-center-form',
  template: '',
})
class MockCostCenterFormComponent {
  @Input() form;
  @Input() unitUid;
}

const costCenterCode = 'b1';

class MockCostCenterService implements Partial<CostCenterService> {
  create = createSpy('create');
  getBudgets = createSpy('getBudgets');
}

class MockCostCenterFormService implements Partial<CostCenterFormService> {
  getForm(): FormGroup {
    return new FormGroup({
      code: new FormControl(costCenterCode),
    });
  }
}

const mockRouterState = {
  state: {
    params: {
      costCenterCode,
    },
  },
};

class MockRoutingService {
  go = createSpy('go').and.stub();
  getRouterState = createSpy('getRouterState').and.returnValue(
    of(mockRouterState)
  );
}

describe('CostCenterCreateComponent', () => {
  let component: CostCenterCreateComponent;
  let fixture: ComponentFixture<CostCenterCreateComponent>;
  let costCenterService: CostCenterService;
  let routingService: RoutingService;
  let saveButton;
  let costCenterFormComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
        IconTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [CostCenterCreateComponent, MockCostCenterFormComponent],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: CostCenterService, useClass: MockCostCenterService },
        { provide: CostCenterFormService, useClass: MockCostCenterFormService },
      ],
    }).compileComponents();

    costCenterService = TestBed.inject(CostCenterService);
    routingService = TestBed.inject(RoutingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    saveButton = fixture.debugElement.query(By.css('button[type=submit]'));
    costCenterFormComponent = fixture.debugElement.query(
      By.css('cx-cost-center-form')
    ).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save valid form', () => {
    it('should disable form on save ', () => {
      saveButton.nativeElement.click();
      expect(costCenterFormComponent.form.disabled).toBeTruthy();
    });

    it('should create cost center', () => {
      saveButton.nativeElement.click();
      expect(costCenterService.create).toHaveBeenCalled();
    });

    it('should navigate to the detail page', () => {
      saveButton.nativeElement.click();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'costCenterDetails',
        params: { code: costCenterCode },
      });
    });
  });

  describe('fail saving invalid form', () => {
    beforeEach(() => {
      costCenterFormComponent.form.setErrors({ incorrect: true });
    });

    it('should not disable form on save when it is invalid', () => {
      saveButton.nativeElement.click();
      expect(costCenterFormComponent.form.disabled).toBeFalsy();
    });

    it('should create cost center', () => {
      saveButton.nativeElement.click();
      expect(costCenterService.create).not.toHaveBeenCalled();
    });

    it('should not navigate away', () => {
      saveButton.nativeElement.click();
      expect(routingService.go).not.toHaveBeenCalled();
    });
  });
});
