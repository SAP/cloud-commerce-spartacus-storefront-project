import { Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import {
  I18nTestingModule,
  RoutingService,
  OrgUnitService,
  RoutesConfig,
  RoutingConfig,
  Currency,
  CurrencyService,
  B2BUnitNode,
  LanguageService,
  B2BUnit,
} from '@spartacus/core';

import { UnitEditComponent } from './unit-edit.component';
import createSpy = jasmine.createSpy;
import { UnitFormModule } from '../unit-form/unit-form.module';
import { defaultStorefrontRoutesConfig } from '../../../../cms-structure/routing/default-routing-config';
import { RouterTestingModule } from '@angular/router/testing';

const code = 'b1';

const mockOrgUnit: B2BUnit = {
  uid: code,
  name: 'orgUnit1',
};

const mockOrgUnits: B2BUnitNode[] = [
  {
    active: true,
    children: [],
    id: 'unitNode1',
    name: 'Org Unit 1',
    parent: 'parentUnit',
  },
];

class MockOrgUnitService implements Partial<OrgUnitService> {
  loadOrgUnits = createSpy('loadOrgUnits').and.returnValue(of(mockOrgUnits));
  getActiveUnitList = createSpy('getActiveUnitList').and.returnValue(
    of(mockOrgUnits)
  );
  loadOrgUnit = createSpy('loadOrgUnit');
  get = createSpy('get').and.returnValue(of(mockOrgUnit));
  getApprovalProcesses = createSpy('getApprovalProcesses');
  update = createSpy('update');
  loadOrgUnitNodes = jasmine.createSpy('loadOrgUnitNodes');
}

const mockRouterState = {
  state: {
    params: {
      code,
    },
  },
};

class MockRoutingService {
  go = createSpy('go').and.stub();
  getRouterState = createSpy('getRouterState').and.returnValue(
    of(mockRouterState)
  );
}

const mockCurrencies: Currency[] = [
  { active: true, isocode: 'USD', name: 'Dolar', symbol: '$' },
  { active: true, isocode: 'EUR', name: 'Euro', symbol: '€' },
];
const mockActiveCurr = 'USD';
const MockCurrencyService = {
  active: mockActiveCurr,
  getAll(): Observable<Currency[]> {
    return of(mockCurrencies);
  },
  getActive(): Observable<string> {
    return of(this.active);
  },
  setActive(isocode: string): void {
    this.active = isocode;
  },
};

const mockRoutesConfig: RoutesConfig = defaultStorefrontRoutesConfig;
class MockRoutingConfig {
  getRouteConfig(routeName: string) {
    return mockRoutesConfig[routeName];
  }
}

class LanguageServiceStub {
  getActive(): Observable<string> {
    return of();
  }
}

describe('UnitEditComponent', () => {
  let component: UnitEditComponent;
  let fixture: ComponentFixture<UnitEditComponent>;
  let orgUnitsService: MockOrgUnitService;
  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, UnitFormModule, RouterTestingModule],
      declarations: [UnitEditComponent],
      providers: [
        {
          provide: LanguageService,
          useClass: LanguageServiceStub,
        },
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: CurrencyService, useValue: MockCurrencyService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
      ],
    }).compileComponents();

    orgUnitsService = TestBed.get(OrgUnitService as Type<OrgUnitService>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load orgUnit', () => {
      component.ngOnInit();
      let orgUnit: any;
      component.orgUnit$
        .subscribe((value) => {
          orgUnit = value;
        })
        .unsubscribe();
      expect(routingService.getRouterState).toHaveBeenCalledWith();
      expect(orgUnitsService.loadOrgUnit).toHaveBeenCalledWith(code);
      expect(orgUnitsService.get).toHaveBeenCalledWith(code);
      expect(orgUnit).toEqual(mockOrgUnit);
    });
  });

  describe('update', () => {
    it('should update orgUnit', () => {
      component.ngOnInit();
      const updateOrgUnit = {
        code,
        name: 'newName',
      };

      component.updateOrgUnit(updateOrgUnit);
      expect(orgUnitsService.update).toHaveBeenCalledWith(code, updateOrgUnit);
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'orgUnitDetails',
        params: updateOrgUnit,
      });
    });
  });
});
