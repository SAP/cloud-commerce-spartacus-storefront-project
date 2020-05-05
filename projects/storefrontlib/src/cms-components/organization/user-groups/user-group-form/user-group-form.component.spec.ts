import { Pipe, PipeTransform, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import {
  I18nTestingModule,
  UserGroupService,
  OrgUnitService,
  B2BUnitNode,
  UserGroup,
} from '@spartacus/core';

import { UserGroupFormComponent } from './user-group-form.component';
import createSpy = jasmine.createSpy;
import { DatePickerModule } from '../../../../shared/components/date-picker/date-picker.module';
import { By } from '@angular/platform-browser';
import { FormErrorsComponent } from '@spartacus/storefront';

const uid = 'b1';

const mockUserGroup: UserGroup = {
  uid,
  name: 'group1',
  orgUnit: { name: 'orgName', uid: 'unitNode1' },
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

class MockOrgUnitService implements Partial<OrgUnitService> {
  loadOrgUnits = createSpy('loadOrgUnits');
  getList = createSpy('getList').and.returnValue(of(mockOrgUnits));
  loadOrgUnitNodes = jasmine.createSpy('loadOrgUnitNodes');
}

class MockUserGroupService implements Partial<UserGroupService> {
  loadUserGroup = createSpy('loadUserGroup');
  get = createSpy('get').and.returnValue(of(mockUserGroup));
  update = createSpy('update');
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('UserGroupFormComponent', () => {
  let component: UserGroupFormComponent;
  let fixture: ComponentFixture<UserGroupFormComponent>;
  let orgUnitService: OrgUnitService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        DatePickerModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterTestingModule,
      ],
      declarations: [UserGroupFormComponent, MockUrlPipe, FormErrorsComponent],
      providers: [
        { provide: OrgUnitService, useClass: MockOrgUnitService },
        { provide: UserGroupService, useClass: MockUserGroupService },
      ],
    }).compileComponents();

    orgUnitService = TestBed.get(OrgUnitService as Type<OrgUnitService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load businessUnits', () => {
      component.ngOnInit();
      let businessUnits: any;
      component.businessUnits$
        .subscribe((value) => {
          businessUnits = value;
        })
        .unsubscribe();
      expect(orgUnitService.loadOrgUnitNodes).toHaveBeenCalledWith();
      expect(orgUnitService.getList).toHaveBeenCalledWith();
      expect(businessUnits).toEqual(mockOrgUnits);
    });

    it('should setup clean form', () => {
      spyOn(component.form, 'patchValue');
      component.userGroupData = null;
      component.ngOnInit();
      expect(component.form.patchValue).not.toHaveBeenCalled();
      expect(component.form.valid).toBeFalsy();
    });

    it('should setup form for update', () => {
      spyOn(component.form, 'patchValue').and.callThrough();
      component.userGroupData = mockUserGroup;
      component.ngOnInit();
      expect(component.form.patchValue).toHaveBeenCalledWith(mockUserGroup);
      // expect(component.form.valid).toBeTruthy();
    });
  });

  describe('verifyUserGroup', () => {
    it('should not emit value if form is invalid', () => {
      spyOn(component.submitForm, 'emit');
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);
      expect(component.submitForm.emit).not.toHaveBeenCalled();
    });

    it('should emit value if form is valid', () => {
      spyOn(component.submitForm, 'emit');
      component.userGroupData = mockUserGroup;
      component.ngOnInit();
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);
      expect(component.submitForm.emit).toHaveBeenCalledWith(
        component.form.value
      );
    });
  });

  describe('back', () => {
    it('should emit clickBack event', () => {
      spyOn(component.clickBack, 'emit');
      component.back();
      expect(component.clickBack.emit).toHaveBeenCalledWith();
    });
  });
});
