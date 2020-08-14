import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  RoutingService,
  Permission,
  Period,
  UrlTestingModule,
} from '@spartacus/core';
import { SplitViewTestingModule } from '@spartacus/storefront';
import { of } from 'rxjs';
import { PermissionType } from '../form/permission-form.service';
import { PermissionEditComponent } from './permission-edit.component';
import { PermissionService } from '../../../core/services/permission.service';
import { IconTestingModule } from 'projects/storefrontlib/src/cms-components/misc/icon/testing/icon-testing.module';

import { CurrentPermissionService } from '../current-permission.service';
import createSpy = jasmine.createSpy;

@Component({
  selector: 'cx-permission-form',
  template: '',
})
class MockPermissionFormComponent {
  @Input() form;
  @Input() editMode;
}

const permissionCode = 'b1';

class MockCurrentPermissionService
  implements Partial<CurrentPermissionService> {
  code$ = of(permissionCode);
}

const mockPermission: Permission = {
  code: permissionCode,
  orderApprovalPermissionType: {
    code: PermissionType.TIMESPAN,
    name: 'Type',
  },
  threshold: 10000,
  currency: {
    symbol: '$',
    isocode: 'USD',
  },
  periodRange: Period.WEEK,
  orgUnit: { name: 'orgName', uid: 'orgCode' },
};

class MockPermissionService implements Partial<PermissionService> {
  update = createSpy('update');
  load = createSpy('load');
  get = createSpy('get').and.returnValue(of(mockPermission));
}

const mockRouterState = {
  state: {
    params: {
      code: permissionCode,
    },
  },
};

class MockRoutingService {
  go = createSpy('go').and.stub();
  getRouterState = createSpy('getRouterState').and.returnValue(
    of(mockRouterState)
  );
}

describe('PermissionEditComponent', () => {
  let component: PermissionEditComponent;
  let fixture: ComponentFixture<PermissionEditComponent>;
  let permissionService: PermissionService;
  let routingService: RoutingService;
  let saveButton;
  let permissionFormComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
        IconTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [PermissionEditComponent, MockPermissionFormComponent],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: PermissionService, useClass: MockPermissionService },
        {
          provide: CurrentPermissionService,
          useClass: MockCurrentPermissionService,
        },
      ],
    }).compileComponents();

    permissionService = TestBed.inject(PermissionService);

    routingService = TestBed.inject(RoutingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    saveButton = fixture.debugElement.query(By.css('button[type=submit]'));
    permissionFormComponent = fixture.debugElement.query(
      By.css('cx-permission-form')
    ).componentInstance;
  });

  // not sure why this is needed, but we're failing otherwise
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save valid form', () => {
    it('should disable form on save ', () => {
      saveButton.nativeElement.click();
      expect(permissionFormComponent.form.disabled).toBeTruthy();
    });

    it('should create permission', () => {
      saveButton.nativeElement.click();
      expect(permissionService.update).toHaveBeenCalled();
    });

    it('should navigate to the detail page', () => {
      saveButton.nativeElement.click();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'permission',
        params: permissionFormComponent.form.value,
      });
    });
    it('should trigger reload of permission model on each code change', () => {
      expect(permissionService.loadPermission).toHaveBeenCalledWith(
        mockPermission.code
      );
    });
  });
});
