import { Pipe, PipeTransform, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CostCenter,
  CostCenterService,
  CxDatePipe,
  I18nTestingModule,
  RoutesConfig,
  RoutingConfig,
  RoutingService,
} from '@spartacus/core';
import { Table2Module } from '@spartacus/storefront';
import { of } from 'rxjs';
import { CostCenterDetailsComponent } from './cost-center-details.component';
import createSpy = jasmine.createSpy;
import { defaultStorefrontRoutesConfig } from 'projects/storefrontlib/src/cms-structure/routing/default-routing-config';

const code = 'b1';

const mockCostCenter: CostCenter = {
  code,
  name: 'costCenter1',
  currency: {
    symbol: '$',
    isocode: 'USD',
  },
  unit: { name: 'orgName', uid: 'orgCode' },
};

const mockCostCenterUI: any = {
  code,
  name: 'costCenter1',
  currency: {
    symbol: '$',
    isocode: 'USD',
  },
  unit: { name: 'orgName', uid: 'orgCode' },
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockCostCenterService implements Partial<CostCenterService> {
  loadCostCenter = createSpy('loadCostCenter');
  get = createSpy('get').and.returnValue(of(mockCostCenter));
  update = createSpy('update');
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

const mockRoutesConfig: RoutesConfig = defaultStorefrontRoutesConfig;
class MockRoutingConfig {
  getRouteConfig(routeName: string) {
    return mockRoutesConfig[routeName];
  }
}

class MockCxDatePipe {
  transform(value: string) {
    return value.split('T')[0];
  }
}

describe('CostCenterDetailsComponent', () => {
  let component: CostCenterDetailsComponent;
  let fixture: ComponentFixture<CostCenterDetailsComponent>;
  let costCentersService: MockCostCenterService;
  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, Table2Module, I18nTestingModule],
      declarations: [CostCenterDetailsComponent, MockUrlPipe],
      providers: [
        { provide: CxDatePipe, useClass: MockCxDatePipe },
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: CostCenterService, useClass: MockCostCenterService },
      ],
    }).compileComponents();

    costCentersService = TestBed.get(
      CostCenterService as Type<CostCenterService>
    );
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load costCenter', () => {
      component.ngOnInit();
      let costCenter: any;
      component.costCenter$
        .subscribe((value) => {
          costCenter = value;
        })
        .unsubscribe();
      expect(routingService.getRouterState).toHaveBeenCalledWith();
      expect(costCentersService.loadCostCenter).toHaveBeenCalledWith(code);
      expect(costCentersService.get).toHaveBeenCalledWith(code);
      expect(costCenter).toEqual(mockCostCenterUI);
    });
  });

  describe('update', () => {
    it('should update costCenter', () => {
      component.ngOnInit();

      component.update({ activeFlag: false });
      expect(costCentersService.update).toHaveBeenCalledWith(code, {
        activeFlag: false,
      });

      component.update({ activeFlag: true });
      expect(costCentersService.update).toHaveBeenCalledWith(code, {
        activeFlag: true,
      });
    });
  });
});
