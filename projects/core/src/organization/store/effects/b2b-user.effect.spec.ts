import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { TestColdObservable } from 'jasmine-marbles/src/test-observables';
import createSpy = jasmine.createSpy;

import { defaultOccOrganizationConfig } from '../../../occ/adapters/organization/default-occ-organization-config';
import { OccConfig } from '../../../occ/config/occ-config';
import { B2BUserConnector } from '../../connectors/b2b-user/b2b-user.connector';
import {
  B2BUserActions,
  PermissionActions,
  UserGroupActions,
} from '../actions/index';
import * as fromEffects from './b2b-user.effect';
import { B2BSearchConfig } from '../../model/search-config';
import { B2BUser } from '../../../model/org-unit.model';
import { Permission } from '../../../model/permission.model';
import { UserGroup } from '../../../model/user-group.model';

const error = 'error';
const userId = 'testUser';
const orgCustomerId = 'orgCustomerId';
const orgCustomer: B2BUser = {
  active: true,
  uid: orgCustomerId,
  name: 'test',
};
const permissionId = 'permissionId';
const permission: Permission = {
  active: true,
  orgUnit: { uid: 'ouid', name: 'ouName' },
  code: permissionId,
};
const userGroupId = 'userGroupId';
const userGroup: UserGroup = {
  uid: userGroupId,
  name: 'The Test Group',
  orgUnit: { uid: 'Rustic' },
};
const approverId = 'approverId';
const pagination = { currentPage: 1 };
const sorts = [{ selected: true, name: 'code' }];
const page = { ids: [orgCustomer.uid], pagination, sorts };
const params: B2BSearchConfig = { sort: 'code' };

class MockB2BUserConnector {
  get = createSpy().and.returnValue(of(orgCustomer));
  getList = createSpy().and.returnValue(
    of({ values: [orgCustomer], pagination, sorts })
  );
  getUserGroups = createSpy().and.returnValue(
    of({ values: [userGroup], pagination, sorts })
  );
  getApprovers = createSpy().and.returnValue(
    of({ values: [orgCustomer], pagination, sorts })
  );
  getPermissions = createSpy().and.returnValue(
    of({ values: [permission], pagination, sorts })
  );
  assignApprover = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, approverId] })
  );
  unassignApprover = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, approverId] })
  );
  assignPermission = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, permissionId] })
  );
  unassignPermission = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, permissionId] })
  );
  assignUserGroup = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, userGroupId] })
  );
  unassignUserGroup = createSpy().and.returnValue(
    of({ values: [userId, orgCustomerId, userGroupId] })
  );
  create = createSpy().and.returnValue(of(orgCustomer));
  update = createSpy().and.returnValue(of(orgCustomer));
}

describe('B2B User Effects', () => {
  let actions$: Observable<B2BUserActions.B2BUserAction>;
  let b2bUserConnector: B2BUserConnector;
  let effects: fromEffects.B2BUserEffects;
  let expected: TestColdObservable;

  const mockB2bUserState = {
    details: {
      entities: {
        testLoadedCode: { loading: false, value: orgCustomer },
        testLoadingCode: { loading: true, value: null },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ orgCustomer: () => mockB2bUserState }),
      ],
      providers: [
        { provide: B2BUserConnector, useClass: MockB2BUserConnector },
        { provide: OccConfig, useValue: defaultOccOrganizationConfig },
        fromEffects.B2BUserEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(
      fromEffects.B2BUserEffects as Type<fromEffects.B2BUserEffects>
    );
    b2bUserConnector = TestBed.get(B2BUserConnector as Type<B2BUserConnector>);
    expected = null;
  });

  describe('loadB2BUser$', () => {
    it('should return LoadB2BUserSuccess action', () => {
      const action = new B2BUserActions.LoadB2BUser({ userId, orgCustomerId });
      const completion = new B2BUserActions.LoadB2BUserSuccess([orgCustomer]);
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.get).toHaveBeenCalledWith(userId, orgCustomerId);
    });

    it('should return LoadB2BUserFail action if user not loaded', () => {
      b2bUserConnector.get = createSpy().and.returnValue(throwError(error));
      const action = new B2BUserActions.LoadB2BUser({ userId, orgCustomerId });
      const completion = new B2BUserActions.LoadB2BUserFail({
        orgCustomerId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.get).toHaveBeenCalledWith(userId, orgCustomerId);
    });
  });

  describe('loadB2BUsers$', () => {
    it('should return LoadB2BUserSuccess action', () => {
      const action = new B2BUserActions.LoadB2BUsers({ userId, params });
      const completion = new B2BUserActions.LoadB2BUserSuccess([orgCustomer]);
      const completion2 = new B2BUserActions.LoadB2BUsersSuccess({
        page,
        params,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-(bc)', { b: completion, c: completion2 });

      expect(effects.loadB2BUsers$).toBeObservable(expected);
      expect(b2bUserConnector.getList).toHaveBeenCalledWith(userId, params);
    });

    it('should return LoadB2BUsersFail action if B2B Users not loaded', () => {
      b2bUserConnector.getList = createSpy().and.returnValue(throwError(error));
      const action = new B2BUserActions.LoadB2BUsers({ userId, params });
      const completion = new B2BUserActions.LoadB2BUsersFail({ error, params });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUsers$).toBeObservable(expected);
      expect(b2bUserConnector.getList).toHaveBeenCalledWith(userId, params);
    });
  });

  describe('loadB2BUserUserGroups$', () => {
    it('should return LoadB2BUserUserGroupsSuccess action', () => {
      const action = new B2BUserActions.LoadB2BUserUserGroups({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new UserGroupActions.LoadUserGroupSuccess([userGroup]);
      const completion2 = new B2BUserActions.LoadB2BUserUserGroupsSuccess({
        orgCustomerId,
        page: { ids: [userGroup.uid], pagination, sorts },
        params,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-(bc)', { b: completion, c: completion2 });

      expect(effects.loadB2BUserUserGroups$).toBeObservable(expected);
      expect(b2bUserConnector.getUserGroups).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });

    it('should return LoadB2BUserUserGroupsFail action if B2BUser UserGroup not loaded', () => {
      b2bUserConnector.getUserGroups = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.LoadB2BUserUserGroups({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new B2BUserActions.LoadB2BUserUserGroupsFail({
        orgCustomerId,
        params,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUserUserGroups$).toBeObservable(expected);
      expect(b2bUserConnector.getUserGroups).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });
  });

  describe('createB2BUser$', () => {
    it('should return CreateB2BUserSuccess action', () => {
      const action = new B2BUserActions.CreateB2BUser({ userId, orgCustomer });
      const completion = new B2BUserActions.CreateB2BUserSuccess(orgCustomer);
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.createB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.create).toHaveBeenCalledWith(userId, orgCustomer);
    });

    it('should return CreateB2BUserFail action if user not created', () => {
      b2bUserConnector.create = createSpy().and.returnValue(throwError(error));
      const action = new B2BUserActions.CreateB2BUser({ userId, orgCustomer });
      const completion = new B2BUserActions.CreateB2BUserFail({
        orgCustomerId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.createB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.create).toHaveBeenCalledWith(userId, orgCustomer);
    });
  });

  describe('updateB2BUser$', () => {
    it('should return UpdateB2BUserSuccess action', () => {
      const action = new B2BUserActions.UpdateB2BUser({
        userId,
        orgCustomerId,
        orgCustomer,
      });
      const completion = new B2BUserActions.UpdateB2BUserSuccess(orgCustomer);
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.updateB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.update).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        orgCustomer
      );
    });

    it('should return UpdateB2BUserFail action if user not updated', () => {
      b2bUserConnector.update = createSpy().and.returnValue(throwError(error));
      const action = new B2BUserActions.UpdateB2BUser({
        userId,
        orgCustomerId,
        orgCustomer,
      });
      const completion = new B2BUserActions.UpdateB2BUserFail({
        orgCustomerId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.updateB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.update).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        orgCustomer
      );
    });
  });

  describe('loadB2BUserApprovers$', () => {
    it('should return LoadB2BUserApproversSuccess action', () => {
      const action = new B2BUserActions.LoadB2BUserApprovers({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new B2BUserActions.LoadB2BUserSuccess([orgCustomer]);
      const completion2 = new B2BUserActions.LoadB2BUserApproversSuccess({
        orgCustomerId,
        page: { ids: [orgCustomerId], pagination, sorts },
        params,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-(bc)', { b: completion, c: completion2 });

      expect(effects.loadB2BUserApprovers$).toBeObservable(expected);
      expect(b2bUserConnector.getApprovers).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });

    it('should return LoadB2BUserApproversFail action if approvers not loaded', () => {
      b2bUserConnector.getApprovers = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.LoadB2BUserApprovers({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new B2BUserActions.LoadB2BUserApproversFail({
        orgCustomerId,
        params,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUserApprovers$).toBeObservable(expected);
      expect(b2bUserConnector.getApprovers).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });
  });

  describe('loadB2BUserPermissions$', () => {
    it('should return LoadB2BUserPermissionsSuccess action', () => {
      const action = new B2BUserActions.LoadB2BUserPermissions({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new PermissionActions.LoadPermissionSuccess([
        permission,
      ]);
      const completion2 = new B2BUserActions.LoadB2BUserPermissionsSuccess({
        orgCustomerId,
        page: { ids: [permissionId], pagination, sorts },
        params,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-(bc)', { b: completion, c: completion2 });

      expect(effects.loadB2BUserPermissions$).toBeObservable(expected);
      expect(b2bUserConnector.getPermissions).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });

    it('should return LoadB2BUserApproversFail action if Permissions not loaded', () => {
      b2bUserConnector.getPermissions = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.LoadB2BUserPermissions({
        userId,
        orgCustomerId,
        params,
      });
      const completion = new B2BUserActions.LoadB2BUserPermissionsFail({
        orgCustomerId,
        params,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.loadB2BUserPermissions$).toBeObservable(expected);
      expect(b2bUserConnector.getPermissions).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        params
      );
    });
  });

  describe('assignApproverToB2BUser$', () => {
    it('should return CreateB2BUserApproverSuccess action', () => {
      const action = new B2BUserActions.CreateB2BUserApprover({
        userId,
        orgCustomerId,
        approverId,
      });
      const completion = new B2BUserActions.CreateB2BUserApproverSuccess({
        approverId,
        selected: true,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignApproverToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignApprover).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        approverId
      );
    });

    it('should return CreateB2BUserApproverFail action if approver not assigned', () => {
      b2bUserConnector.assignApprover = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.CreateB2BUserApprover({
        userId,
        orgCustomerId,
        approverId,
      });
      const completion = new B2BUserActions.CreateB2BUserApproverFail({
        orgCustomerId,
        approverId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignApproverToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignApprover).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        approverId
      );
    });
  });

  describe('unassignApproverFromB2BUser$', () => {
    it('should return DeleteB2BUserApproverSuccess action', () => {
      const action = new B2BUserActions.DeleteB2BUserApprover({
        userId,
        orgCustomerId,
        approverId,
      });
      const completion = new B2BUserActions.DeleteB2BUserApproverSuccess({
        approverId,
        selected: false,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignApproverFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignApprover).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        approverId
      );
    });

    it('should return DeleteB2BUserApproverFail action if approver not unassigned', () => {
      b2bUserConnector.unassignApprover = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.DeleteB2BUserApprover({
        userId,
        orgCustomerId,
        approverId,
      });
      const completion = new B2BUserActions.DeleteB2BUserApproverFail({
        orgCustomerId,
        approverId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignApproverFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignApprover).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        approverId
      );
    });
  });

  describe('assignPermissionToB2BUser$', () => {
    it('should return CreateB2BUserPermissionSuccess action', () => {
      const action = new B2BUserActions.CreateB2BUserPermission({
        userId,
        orgCustomerId,
        permissionId,
      });
      const completion = new B2BUserActions.CreateB2BUserPermissionSuccess({
        permissionId,
        selected: true,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignPermissionToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignPermission).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        permissionId
      );
    });

    it('should return CreateB2BUserPermissionFail action if permission not assigned', () => {
      b2bUserConnector.assignPermission = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.CreateB2BUserPermission({
        userId,
        orgCustomerId,
        permissionId,
      });
      const completion = new B2BUserActions.CreateB2BUserPermissionFail({
        orgCustomerId,
        permissionId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignPermissionToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignPermission).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        permissionId
      );
    });
  });

  describe('unassignPermissionFromB2BUser$', () => {
    it('should return DeleteB2BUserPermissionSuccess action', () => {
      const action = new B2BUserActions.DeleteB2BUserPermission({
        userId,
        orgCustomerId,
        permissionId,
      });
      const completion = new B2BUserActions.DeleteB2BUserPermissionSuccess({
        permissionId,
        selected: false,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignPermissionFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignPermission).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        permissionId
      );
    });

    it('should return DeleteB2BUserPermissionFail action if permission not unassigned', () => {
      b2bUserConnector.unassignPermission = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.DeleteB2BUserPermission({
        userId,
        orgCustomerId,
        permissionId,
      });
      const completion = new B2BUserActions.DeleteB2BUserPermissionFail({
        orgCustomerId,
        permissionId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignPermissionFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignPermission).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        permissionId
      );
    });
  });

  describe('assignUserGroupToB2BUser$', () => {
    it('should return CreateB2BUserUserGroupSuccess action', () => {
      const action = new B2BUserActions.CreateB2BUserUserGroup({
        userId,
        orgCustomerId,
        userGroupId,
      });
      const completion = new B2BUserActions.CreateB2BUserUserGroupSuccess({
        userGroupId,
        selected: true,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignUserGroupToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignUserGroup).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        userGroupId
      );
    });

    it('should return CreateB2BUserUserGroupFail action if UserGroup was not assigned', () => {
      b2bUserConnector.assignUserGroup = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.CreateB2BUserUserGroup({
        userId,
        orgCustomerId,
        userGroupId,
      });
      const completion = new B2BUserActions.CreateB2BUserUserGroupFail({
        orgCustomerId,
        userGroupId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.assignUserGroupToB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.assignUserGroup).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        userGroupId
      );
    });
  });

  describe('unassignUserGroupFromB2BUser$', () => {
    it('should return DeleteB2BUserUserGroupSuccess action', () => {
      const action = new B2BUserActions.DeleteB2BUserUserGroup({
        userId,
        orgCustomerId,
        userGroupId,
      });
      const completion = new B2BUserActions.DeleteB2BUserUserGroupSuccess({
        userGroupId,
        selected: false,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignUserGroupFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignUserGroup).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        userGroupId
      );
    });

    it('should return DeleteB2BUserUserGroupFail action if UserGroup was not unassigned', () => {
      b2bUserConnector.unassignUserGroup = createSpy().and.returnValue(
        throwError(error)
      );
      const action = new B2BUserActions.DeleteB2BUserUserGroup({
        userId,
        orgCustomerId,
        userGroupId,
      });
      const completion = new B2BUserActions.DeleteB2BUserUserGroupFail({
        orgCustomerId,
        userGroupId,
        error,
      });
      actions$ = hot('-a', { a: action });
      expected = cold('-b', { b: completion });

      expect(effects.unassignUserGroupFromB2BUser$).toBeObservable(expected);
      expect(b2bUserConnector.unassignUserGroup).toHaveBeenCalledWith(
        userId,
        orgCustomerId,
        userGroupId
      );
    });
  });
});
