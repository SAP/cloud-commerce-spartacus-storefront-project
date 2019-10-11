import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromInterestsEffect from './product-interests.effect';
import { UserActions } from '../actions/index';
import { Actions } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { ProductInterestSearchResult } from '../../../model/product-interest.model';
import { hot, cold } from 'jasmine-marbles';
import { UserInterestsConnector } from '../../connectors/interests/user-interests.connector';
import { UserInterestsAdapter } from '../../connectors/interests/user-interests.adapter';
import { Type } from '@angular/core';
const loadParams = {
  userId: 'qingyu@sap.com',
  pageSize: 5,
  currentPage: 1,
  sort: 'name:asc',
};
const delParams = {
  userId: 'qingyu@sap.com',
  item: {},
};

describe('Product Interests Effect', () => {
  let actions$: Actions;
  let productInterestsEffect: fromInterestsEffect.ProductInterestsEffect;
  let userInterestConnector: UserInterestsConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        fromInterestsEffect.ProductInterestsEffect,
        { provide: UserInterestsAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    // actions$ = TestBed.get(Actions);
    productInterestsEffect = TestBed.get(
      fromInterestsEffect.ProductInterestsEffect as Type<
        fromInterestsEffect.ProductInterestsEffect
      >
    );
    userInterestConnector = TestBed.get(UserInterestsConnector as Type<
      UserInterestsConnector
    >);
  });

  describe('loadProductInteres$', () => {
    it('should be able to load product interests', () => {
      const interests: ProductInterestSearchResult = {
        results: [],
        sorts: [],
        pagination: {},
      };
      spyOn(userInterestConnector, 'getInterests').and.returnValue(
        of(interests)
      );
      const action = new UserActions.LoadProductInterests(loadParams);
      const completion = new UserActions.LoadProductInterestsSuccess(interests);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(productInterestsEffect.loadProductInteres$).toBeObservable(
        expected
      );
    });
    it('should be able to handle failures for load product interests', () => {
      spyOn(userInterestConnector, 'getInterests').and.returnValue(
        throwError('Error')
      );
      const action = new UserActions.LoadProductInterests(loadParams);
      const completion = new UserActions.LoadProductInterestsFail('Error');

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(productInterestsEffect.loadProductInteres$).toBeObservable(
        expected
      );
    });
  });

  describe('removeProductInterests$', () => {
    it('should be able to remove product interest', () => {
      const delRes = '200';
      spyOn(userInterestConnector, 'removeInterests').and.returnValue(
        of([delRes])
      );
      const action = new UserActions.RemoveProductInterest(delParams);
      const loadSuccess = new UserActions.LoadProductInterests({
        userId: delParams.userId,
      });
      const removeSuccess = new UserActions.RemoveProductInterestSuccess([
        delRes,
      ]);

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: loadSuccess, c: removeSuccess });
      expect(productInterestsEffect.removeProductInterests$).toBeObservable(
        expected
      );
    });

    it('should be able to handle failures for remove product interest', () => {
      spyOn(userInterestConnector, 'removeInterests').and.returnValue(
        throwError('Error')
      );
      const action = new UserActions.RemoveProductInterest(delParams);
      const completion = new UserActions.RemoveProductInterestFail('Error');

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(productInterestsEffect.removeProductInterests$).toBeObservable(
        expected
      );
    });
  });
});
