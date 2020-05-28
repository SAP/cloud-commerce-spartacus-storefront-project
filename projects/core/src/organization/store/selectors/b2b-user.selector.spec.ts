import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';

import { B2BUserActions } from '../actions/index';
import {
  ORGANIZATION_FEATURE,
  StateWithOrganization,
  B2BUserManagement,
} from '../organization-state';
import * as fromReducers from '../reducers/index';
import { B2BUserSelectors } from '../selectors/index';
import { EntityLoaderState } from '../../../state/utils/entity-loader/index';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { B2BUser } from '../../../model/org-unit.model';

describe('B2BUser Selectors', () => {
  let store: Store<StateWithOrganization>;
  const customerId = 'orgCustomerId';
  const orgCustomer: B2BUser = {
    active: true,
    customerId,
    uid: 'aaa@bbb',
  };
  const orgCustomer2: B2BUser = {
    active: true,
    customerId: 'orgCustomerId2',
    uid: 'bbb@aaa',
  };

  const entities = {
    orgCustomerId: {
      loading: false,
      error: false,
      success: true,
      value: orgCustomer,
    },
    orgCustomerId2: {
      loading: false,
      error: false,
      success: true,
      value: orgCustomer2,
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

  describe('getB2BUserManagementState ', () => {
    it('should return B2BUserManagement state', () => {
      let result: B2BUserManagement;
      store
        .pipe(select(B2BUserSelectors.getB2BUserManagementState))
        .subscribe((value) => (result = value));

      store.dispatch(
        new B2BUserActions.LoadB2BUserSuccess([orgCustomer, orgCustomer2])
      );
      expect(result).toEqual({
        entities: { entities },
        list: { entities: {} },
        approvers: { entities: {} },
        permissions: { entities: {} },
        userGroups: { entities: {} },
      });
    });
  });

  describe('getB2BUsersState', () => {
    it('should return B2B Users state', () => {
      let result: EntityLoaderState<B2BUser>;
      store
        .pipe(select(B2BUserSelectors.getB2BUsersState))
        .subscribe((value) => (result = value));

      store.dispatch(
        new B2BUserActions.LoadB2BUserSuccess([orgCustomer, orgCustomer2])
      );
      expect(result).toEqual({ entities });
    });
  });

  describe('getB2BUserState', () => {
    it('should return B2B User state', () => {
      let result: LoaderState<B2BUser>;
      store
        .pipe(select(B2BUserSelectors.getB2BUserState(orgCustomerId)))
        .subscribe((value) => (result = value));

      store.dispatch(
        new B2BUserActions.LoadB2BUserSuccess([orgCustomer, orgCustomer2])
      );
      expect(result).toEqual(entities.orgCustomerId);
    });
  });

  describe('getUserList', () => {
    it('should return B2BUser list', () => {
      let result: EntityLoaderState<B2BUser>;
      store
        .pipe(select(B2BUserSelectors.getB2BUsersState))
        .subscribe((value) => (result = value));

      store.dispatch(
        new B2BUserActions.LoadB2BUserSuccess([orgCustomer, orgCustomer2])
      );
      expect(result).toEqual({ entities });
    });
  });

  describe('getB2BUserState ', () => {
    it('should return B2B User state', () => {
      let result: LoaderState<B2BUser>;
      store
        .pipe(select(B2BUserSelectors.getB2BUserState(orgCustomerId)))
        .subscribe((value) => (result = value));

      store.dispatch(new B2BUserActions.LoadB2BUserSuccess([orgCustomer]));
      expect(result).toEqual(entities.orgCustomerId);
    });
  });
});
