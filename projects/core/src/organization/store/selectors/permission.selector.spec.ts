import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import {
  OrderApprovalPermissionType,
  Permission,
} from '../../../model/permission.model';
import { EntityLoaderState } from '../../../state/utils/entity-loader/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { PermissionActions } from '../actions/index';
import {
  ORGANIZATION_FEATURE,
  PermissionManagement,
  StateWithOrganization,
} from '../organization-state';
import * as fromReducers from '../reducers/index';
import { PermissionSelectors } from '../selectors/index';

describe('Permission Selectors', () => {
  let store: Store<StateWithOrganization>;

  const code = 'testCode';
  const permission: Permission = {
    code,
  };
  const permission2: Permission = {
    code: 'testCode2',
  };
  const permissionType: OrderApprovalPermissionType = {
    code: 'testPermissionTypeCode',
    name: 'testPermissionTypeName',
  };
  const permissionTypes: OrderApprovalPermissionType[] = [permissionType];

  const entities = {
    testCode: {
      loading: false,
      error: false,
      success: true,
      value: permission,
    },
    testCode2: {
      loading: false,
      error: false,
      success: true,
      value: permission2,
    },
  };

  const entities2 = {
    testCode: {
      loading: false,
      error: false,
      success: true,
      value: permissionTypes,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          ORGANIZATION_FEATURE,
          fromReducers.getReducers()
        ),
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithOrganization>>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getPermissionManagementState ', () => {
    it('should return permissions state', () => {
      let result: PermissionManagement;
      store
        .pipe(select(PermissionSelectors.getPermissionManagementState))
        .subscribe((value) => (result = value));

      store.dispatch(
        new PermissionActions.LoadPermissionSuccess([permission, permission2])
      );
      expect(result).toEqual({
        entities: { entities },
        list: { entities: {} },
        permissionTypes: { entities: {} },
      });
    });
  });

  describe('getPermissions', () => {
    it('should return permissions', () => {
      let result: EntityLoaderState<Permission>;
      store
        .pipe(select(PermissionSelectors.getPermissionsState))
        .subscribe((value) => (result = value));

      store.dispatch(
        new PermissionActions.LoadPermissionSuccess([permission, permission2])
      );
      expect(result).toEqual({ entities });
    });
  });

  describe('getPermission', () => {
    it('should return permission by id', () => {
      let result: LoaderState<Permission>;
      store
        .pipe(select(PermissionSelectors.getPermission(code)))
        .subscribe((value) => (result = value));

      store.dispatch(
        new PermissionActions.LoadPermissionSuccess([permission, permission2])
      );
      expect(result).toEqual(entities.testCode);
    });
  });

  describe('getPermissionTypes', () => {
    it('should return permission types', () => {
      let result: LoaderState<OrderApprovalPermissionType[]>;
      store
        .pipe(select(PermissionSelectors.getPermissionTypes()))
        .subscribe((value) => (result = value));

      store.dispatch(
        new PermissionActions.LoadPermissionTypesSuccess(permissionTypes)
      );
      expect(result).toEqual(entities2.testCode);
    });
  });
});
