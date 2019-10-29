import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { Budget } from '../../model/budget.model';
import { PROCESS_FEATURE } from '../../process/store/process-state';
import * as fromProcessReducers from '../../process/store/reducers';
import { BudgetActions } from '../store/actions/index';
import * as fromReducers from '../store/reducers/index';
import { BudgetService } from './budget.service';
import {
  AuthService,
  LoaderState,
  ORGANIZATION_FEATURE,
  StateWithOrganization,
} from '@spartacus/core';
import createSpy = jasmine.createSpy;

const userId = 'current';
const budgetCode = 'testBudget';
const budget1 = { code: budgetCode };
const budget2 = { code: 'testBudget2' };

class MockAuthService {
  getOccUserId = createSpy().and.returnValue(of(userId));
}

describe('BudgetService', () => {
  let service: BudgetService;
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
        BudgetService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    store = TestBed.get(Store as Type<Store<StateWithOrganization>>);
    service = TestBed.get(BudgetService as Type<BudgetService>);
    authService = TestBed.get(AuthService as Type<AuthService>);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should BudgetService is injected', inject(
    [BudgetService],
    (budgetService: BudgetService) => {
      expect(budgetService).toBeTruthy();
    }
  ));

  describe('get budget', () => {
    it('get() should trigger load budget details when they are not present in the store', () => {
      let budgetDetails: Budget;
      service
        .get(budgetCode)
        .subscribe(data => {
          budgetDetails = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(budgetDetails).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new BudgetActions.LoadBudget({ userId, budgetCode })
      );
    });

    it('get() should be able to get budget details when they are present in the store', () => {
      store.dispatch(new BudgetActions.LoadBudgetSuccess([budget1, budget2]));
      let budgetDetails: Budget;
      service
        .get(budgetCode)
        .subscribe(data => {
          budgetDetails = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(budgetDetails).toEqual(budget1);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new BudgetActions.LoadBudget({ userId, budgetCode })
      );
    });
  });

  describe('get budgets', () => {
    const params = undefined;

    it('getList() should trigger load budgets when they are not present in the store', () => {
      let budgets: LoaderState<Budget>;
      service
        .getList(params)
        .subscribe(data => {
          budgets = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(budgets).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith(
        new BudgetActions.LoadBudgets({ userId, params })
      );
    });

    it('getList() should be able to get budgets when they are present in the store', () => {
      store.dispatch(new BudgetActions.LoadBudgetSuccess([budget1, budget2]));
      store.dispatch(new BudgetActions.LoadBudgetsSuccess());
      let budgets: LoaderState<Budget>;
      service
        .getList(params)
        .subscribe(data => {
          budgets = data;
        })
        .unsubscribe();

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(budgets).toEqual({
        [budget1.code]: {
          loading: false,
          error: false,
          success: true,
          value: budget1,
        },
        [budget2.code]: {
          loading: false,
          error: false,
          success: true,
          value: budget2,
        },
      });
      expect(store.dispatch).not.toHaveBeenCalledWith(
        new BudgetActions.LoadBudgets({ userId, params })
      );
    });
  });

  describe('create budget', () => {
    it('create() should should dispatch CreateBudget action', () => {
      service.create(budget1);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new BudgetActions.CreateBudget({ userId, budget: budget1 })
      );
    });
  });

  describe('update budget', () => {
    it('update() should should dispatch UpdateBudget action', () => {
      service.update(budget1);

      expect(authService.getOccUserId).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new BudgetActions.UpdateBudget({ userId, budget: budget1 })
      );
    });
  });
});
