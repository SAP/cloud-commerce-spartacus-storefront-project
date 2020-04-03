import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import createSpy = jasmine.createSpy;

import { EntitiesModel } from '../../model/misc.model';
import { PROCESS_FEATURE } from '../../process/store/process-state';
import * as fromProcessReducers from '../../process/store/reducers';
import {
  UserGroupActions,
  PermissionActions,
  B2BUserActions,
} from '../store/actions/index';
import * as fromReducers from '../store/reducers/index';
import { B2BSearchConfig } from '../model/search-config';
import {
  AuthService,
  ORGANIZATION_FEATURE,
  StateWithOrganization,
  UserGroup,
  UserGroupService,
  Permission,
} from '@spartacus/core';
import { B2BUser } from '../../model';

const userId = 'current';
const testUserGroupId = 'testOrgUnitUserGroup';
const userGroup = {
  uid: testUserGroupId,
  name: 'The Test Group',
  orgUnit: { uid: 'Rustic' },
};
const userGroup2 = {
  uid: 'testOrgUnitUserGroup2',
  name: 'The Test Group',
  orgUnit: { uid: 'Rustic' },
};
const pagination = { currentPage: 1 };
const sorts = [{ selected: true, name: 'byName' }];
const userGroupList: EntitiesModel<UserGroup> = {
  values: [userGroup, userGroup2],
  pagination,
  sorts,
};

const permissionUid = 'permissionUid';
const permission = {
  code: permissionUid,
};
const permission2 = {
  code: 'permissionUid2',
};
const permissionList: EntitiesModel<Permission> = {
  values: [permission, permission2],
  pagination,
  sorts,
};

const customerId = 'customerId';
const member = {
  uid: customerId,
};
const member2 = {
  uid: 'customerId2',
};
const memberList: EntitiesModel<B2BUser> = {
  values: [member, member2],
  pagination,
  sorts,
};

class MockAuthService {
  getOccUserId = createSpy().and.returnValue(of(userId));
}

describe('UserGroupService', () => {
  let service: UserGroupService;
  let authService: AuthService;
  let store: Store<StateWithOrganization>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          ORGANIZATION_FEATURE,
          fromReducers.getReducers()
        ),
        StoreModule.forFeature(
          PROCESS_FEATURE,
          fromProcessReducers.getReducers()
        ),
      ],
      providers: [
        UserGroupService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    store = TestBed.inject(Store as Type<Store<StateWithOrganization>>);
    service = TestBed.inject(UserGroupService as Type<UserGroupService>);
    authService = TestBed.inject(AuthService as Type<AuthService>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should UserGroupService is injected', inject(
    [UserGroupService],
    (userGroupService: UserGroupService) => {
      expect(userGroupService).toBeTruthy();
    }
  ));

  describe('get userGroup', () => {
    it('get() should trigger load userGroup details when they are not present in the store', () => {
      let userGroupDetails: UserGroup;
      service
        .get(testUserGroupId)
        .subscribe(data => {
          userGroupDetails = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(userGroupDetails).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.LoadUserGroup({
          userId,
          userGroupId: testUserGroupId,
        })
      );
    });

    it('get() should be able to get userGroup details when they are present in the store', () => {
      store.dispatch(
        new UserGroupActions.LoadUserGroupSuccess([userGroup, userGroup2])
      );
      let userGroupDetails: UserGroup;
      service
        .get(testUserGroupId)
        .subscribe(data => {
          userGroupDetails = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).not.toHaveBeenCalled();
      expect(userGroupDetails).toEqual(userGroup);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new UserGroupActions.LoadUserGroup({
          userId,
          userGroupId: testUserGroupId,
        })
      );
    });
  });

  describe('get userGroups', () => {
    const params: B2BSearchConfig = { sort: 'byName' };

    it('getList() should trigger load userGroups when they are not present in the store', () => {
      let userGroups: EntitiesModel<UserGroup>;
      service
        .getList(params)
        .subscribe(data => {
          userGroups = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(userGroups).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.LoadUserGroups({ userId, params })
      );
    });

    it('getList() should be able to get userGroups when they are present in the store', () => {
      store.dispatch(
        new UserGroupActions.LoadUserGroupSuccess([userGroup, userGroup2])
      );
      store.dispatch(
        new UserGroupActions.LoadUserGroupsSuccess({
          params,
          page: {
            ids: [userGroup.uid, userGroup2.uid],
            pagination,
            sorts,
          },
        })
      );
      let userGroups: EntitiesModel<UserGroup>;
      service
        .getList(params)
        .subscribe(data => {
          userGroups = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).not.toHaveBeenCalled();
      expect(userGroups).toEqual(userGroupList);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new UserGroupActions.LoadUserGroups({ userId, params })
      );
    });
  });

  describe('create userGroup', () => {
    it('create() should should dispatch CreateOrgUnitUserGroup action', () => {
      service.create(userGroup);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.CreateUserGroup({
          userId,
          userGroup,
        })
      );
    });
  });

  describe('update userGroup', () => {
    it('update() should should dispatch UpdateOrgUnitUserGroup action', () => {
      service.update(testUserGroupId, userGroup);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.UpdateUserGroup({
          userId,
          userGroupId: testUserGroupId,
          userGroup,
        })
      );
    });
  });

  describe('delete userGroup', () => {
    it('delete() should should dispatch UpdateOrgUnitUserGroup action', () => {
      service.delete(testUserGroupId);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.DeleteUserGroup({
          userId,
          userGroupId: testUserGroupId,
        })
      );
    });
  });

  describe('get permissions', () => {
    const params: B2BSearchConfig = { sort: 'uid' };

    it('getOrgUnitUserGroupAvailableOrderApprovalPermissions() should trigger load permissions when they are not present in the store', () => {
      let permissions: EntitiesModel<Permission>;
      service
        .getAvailableOrderApprovalPermissions(testUserGroupId, params)
        .subscribe(data => {
          permissions = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(permissions).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.LoadPermissions({
          userId,
          userGroupId: testUserGroupId,
          params,
        })
      );
    });

    it('getOrgUnitUserGroupAvailableOrderApprovalPermissions() should be able to get permissions when they are present in the store', () => {
      store.dispatch(
        new PermissionActions.LoadPermissionSuccess([permission, permission2])
      );
      store.dispatch(
        new UserGroupActions.LoadPermissionsSuccess({
          userGroupId: testUserGroupId,
          params,
          page: {
            ids: [permission.code, permission2.code],
            pagination,
            sorts,
          },
        })
      );
      let permissions: EntitiesModel<Permission>;
      service
        .getAvailableOrderApprovalPermissions(testUserGroupId, params)
        .subscribe(data => {
          permissions = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).not.toHaveBeenCalled();
      expect(permissions).toEqual(permissionList);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new PermissionActions.LoadPermissions({ userId, params })
      );
    });
  });

  describe('assign permission to userGroup', () => {
    it('assignPermission() should should dispatch CreateOrgUnitUserGroupOrderApprovalPermission action', () => {
      service.assignPermission(testUserGroupId, permissionUid);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.AssignPermission({
          userId,
          userGroupId: testUserGroupId,
          permissionUid,
        })
      );
    });
  });

  describe('unassign permission from userGroup', () => {
    it('unassignPermission() should should dispatch DeleteOrgUnitUserGroupOrderApprovalPermission action', () => {
      service.unassignPermission(testUserGroupId, permissionUid);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.UnassignPermission({
          userId,
          userGroupId: testUserGroupId,
          permissionUid,
        })
      );
    });
  });

  describe('get members', () => {
    const params: B2BSearchConfig = { sort: 'uid' };

    it('getOrgUnitUserGroupAvailableOrgCustomers() should trigger load members when they are not present in the store', () => {
      let members: EntitiesModel<B2BUser>;
      service
        .getAvailableOrgCustomers(testUserGroupId, params)
        .subscribe(data => {
          members = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(members).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.LoadAvailableOrgCustomers({
          userId,
          userGroupId: testUserGroupId,
          params,
        })
      );
    });

    it('getOrgUnitUserGroupAvailableOrgCustomers() should be able to get members when they are present in the store', () => {
      store.dispatch(new B2BUserActions.LoadB2BUserSuccess([member, member2]));
      store.dispatch(
        new UserGroupActions.LoadAvailableOrgCustomersSuccess({
          userGroupId: testUserGroupId,
          params,
          page: {
            ids: [member.uid, member2.uid],
            pagination,
            sorts,
          },
        })
      );
      let members: EntitiesModel<B2BUser>;
      service
        .getAvailableOrgCustomers(testUserGroupId, params)
        .subscribe(data => {
          members = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).not.toHaveBeenCalled();
      expect(members).toEqual(memberList);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new B2BUserActions.LoadB2BUsers({ userId, params })
      );
    });
  });

  describe('assign members to userGroup', () => {
    it('assignMember() should should dispatch CreateOrgUnitUserGroupMember action', () => {
      service.assignMember(testUserGroupId, customerId);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.AssignMember({
          userId,
          userGroupId: testUserGroupId,
          customerId,
        })
      );
    });
  });

  describe('unassign members from userGroup', () => {
    it('unassignMember() should should dispatch DeleteOrgUnitUserGroupMember action', () => {
      service.unassignMember(testUserGroupId, customerId);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.UnassignMember({
          userId,
          userGroupId: testUserGroupId,
          customerId,
        })
      );
    });
  });

  describe('unassign all members from userGroup', () => {
    it('unassignMember() should should dispatch DeleteOrgUnitUserGroupMember action', () => {
      service.unassignAllMembers(testUserGroupId);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserGroupActions.UnassignAllMembers({
          userId,
          userGroupId: testUserGroupId,
        })
      );
    });
  });
});
