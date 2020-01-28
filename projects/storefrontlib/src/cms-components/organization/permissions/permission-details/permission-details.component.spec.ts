import { Pipe, PipeTransform, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import {
  I18nTestingModule,
  RoutingService,
  PermissionService,
  CxDatePipe,
  RoutesConfig,
  RoutingConfig,
  Permission,
} from '@spartacus/core';

import { PermissionDetailsComponent } from './permission-details.component';
import createSpy = jasmine.createSpy;
import { defaultStorefrontRoutesConfig } from '../../../../cms-structure/routing/default-routing-config';
import { TableModule } from '../../../../shared/components/table/table.module';

const permissionCode = 'b1';

const mockPermission: Permission = {
  code: permissionCode,
  name: 'permission1',
  permission: 2230,
  currency: {
    symbol: '$',
    isocode: 'USD',
  },
  startDate: '2010-01-01T00:00:00+0000',
  endDate: '2034-07-12T00:59:59+0000',
  orgUnit: { name: 'orgName' },
  costCenters: [
    { name: 'costCenter1', code: 'cc1' },
    { name: 'costCenter2', code: 'cc2' },
  ],
};
const mockPermissionUI: any = {
  code: permissionCode,
  name: 'permission1',
  permission: 2230,
  currency: {
    isocode: 'USD',
    symbol: '$',
  },
  startDate: '2010-01-01T00:00:00+0000',
  endDate: '2034-07-12T00:59:59+0000',
  orgUnit: { name: 'orgName' },
  costCenters: [
    { name: 'costCenter1', costCenterCode: 'cc1' },
    { name: 'costCenter2', costCenterCode: 'cc2' },
  ],
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockPermissionService implements Partial<PermissionService> {
  loadPermission = createSpy('loadPermission');
  get = createSpy('get').and.returnValue(of(mockPermission));
  update = createSpy('update');
}

const mockRouterState = {
  state: {
    params: {
      permissionCode,
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

describe('PermissionDetailsComponent', () => {
  let component: PermissionDetailsComponent;
  let fixture: ComponentFixture<PermissionDetailsComponent>;
  let permissionsService: MockPermissionService;
  let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TableModule, I18nTestingModule],
      declarations: [PermissionDetailsComponent, MockUrlPipe],
      providers: [
        { provide: CxDatePipe, useClass: MockCxDatePipe },
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: PermissionService, useClass: MockPermissionService },
      ],
    }).compileComponents();

    permissionsService = TestBed.get(PermissionService as Type<
      PermissionService
    >);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load permission', () => {
      component.ngOnInit();
      let permission: any;
      component.permission$
        .subscribe(value => {
          permission = value;
        })
        .unsubscribe();
      expect(routingService.getRouterState).toHaveBeenCalled();
      expect(permissionsService.loadPermission).toHaveBeenCalledWith(
        permissionCode
      );
      expect(permissionsService.get).toHaveBeenCalledWith(permissionCode);
      expect(permission).toEqual(mockPermissionUI);
    });
  });

  describe('update', () => {
    it('should update permission', () => {
      component.ngOnInit();

      component.update({ active: false });
      expect(permissionsService.update).toHaveBeenCalledWith(permissionCode, {
        active: false,
      });

      component.update({ active: true });
      expect(permissionsService.update).toHaveBeenCalledWith(permissionCode, {
        active: true,
      });
    });
  });
});
