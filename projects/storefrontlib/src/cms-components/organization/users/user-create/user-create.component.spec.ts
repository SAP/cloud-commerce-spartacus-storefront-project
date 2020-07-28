import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import {
  I18nTestingModule,
  RoutingService,
  B2BUserService,
  RoutesConfig,
  RoutingConfig,
  B2BUser,
  OrgUnitService,
  B2BUnitNode,
  UserService,
  Title,
} from '@spartacus/core';

import { B2BUserCreateComponent } from './user-create.component';
import createSpy = jasmine.createSpy;
import { B2BUserFormModule } from '../user-form/user-form.module';
import { defaultStorefrontRoutesConfig } from '../../../../cms-structure/routing/default-routing-config';
import { RouterTestingModule } from '@angular/router/testing';
import { Type } from '@angular/core';

const userCode = 'c1';

const mockUser: B2BUser = {
  name: 'Akiro Nakamura',
  uid: 'akiro@naka.com',
  active: true,
  approvers: [],
  currency: {
    active: true,
    isocode: 'USD',
    name: 'US Dollar',
    symbol: '$',
  },
  customerId: '08ecc0b1-16ef-4a74-a1dd-4a244300c974',
  displayUid: 'akiro@naka.com',
  firstName: 'Akiro',
  lastName: 'Nakamura',
  orgUnit: {
    active: true,
    name: 'Rustic',
    uid: 'Rustic',
  },
  roles: ['b2bmanagergroup'],
  selected: false,
  title: 'Mr.',
  titleCode: 'mr',
  email: 'akiro@naka.com',
};

const mockOrgUnits: B2BUnitNode[] = [
  {
    active: true,
    children: [],
    id: 'unitNode1',
    name: 'Org Unit 1',
    parent: 'parentUnit',
  },
  {
    active: true,
    children: [],
    id: 'unitNode2',
    name: 'Org Unit 2',
    parent: 'parentUnit',
  },
];

const mockRoles = [
  { name: 'buyer', id: 'b2bcustomergroup', selected: false },
  { name: 'manager', id: 'b2bmanagergroup', selected: false },
  { name: 'approver', id: 'b2bapprovergroup', selected: false },
  { name: 'administrator', id: 'b2badmingroup', selected: false },
];

const mockTitles: Title[] = [
  {
    code: 'mr',
    name: 'Mr.',
  },
  {
    code: 'mrs',
    name: 'Mrs.',
  },
  {
    code: 'dr',
    name: 'Dr.',
  },
  {
    code: 'rev',
    name: 'Rev.',
  },
];

class MockUserService {
  getTitles = createSpy('getTitles').and.returnValue(of(mockTitles));
  loadTitles = createSpy('loadTitles');
}

class MockOrgUnitService implements Partial<OrgUnitService> {
  loadOrgUnits = createSpy('loadOrgUnits');
  getActiveUnitList = createSpy('getActiveUnitList').and.returnValue(
    of(mockOrgUnits)
  );
  loadOrgUnitNodes = jasmine.createSpy('loadOrgUnitNodes');
}
class MockB2BUserService implements Partial<B2BUserService> {
  loadB2BUser = createSpy('loadB2BUser');
  get = createSpy('get').and.returnValue(of(mockUser));
  create = createSpy('create');
  updateB2BUser = createSpy('updateB2BUser');
  getB2BUserRoles = createSpy('getB2BUserRoles').and.returnValue(mockRoles);
}

const mockRouterState = {
  state: {
    params: {
      userCode,
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

describe('B2BUserCreateComponent', () => {
  let component: B2BUserCreateComponent;
  let fixture: ComponentFixture<B2BUserCreateComponent>;
  let b2bUserService: MockB2BUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, B2BUserFormModule, RouterTestingModule],
      declarations: [B2BUserCreateComponent],
      providers: [
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: UserService, useClass: MockUserService },
        { provide: B2BUserService, useClass: MockB2BUserService },
      ],
    }).compileComponents();

    b2bUserService = TestBed.get(B2BUserService as Type<B2BUserService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2BUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createB2BUser', () => {
    it('should create user', () => {
      component.createB2BUser(mockUser);
      expect(b2bUserService.create).toHaveBeenCalledWith(mockUser);
    });
  });
});
