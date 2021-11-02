import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  CartActions,
  CartConnector,
  getMultiCartReducers,
  MULTI_CART_FEATURE,
  SaveCartConnector,
  StateWithMultiCart,
} from '@spartacus/cart/main/core';
import { Cart, CartType, SaveCartResult } from '@spartacus/cart/main/root';
import { SiteContextActions, UserIdService } from '@spartacus/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { getCartIdByUserId, getWishlistName } from '../../utils/utils';
import { WishListActions } from '../actions';
import * as fromEffects from './wish-list.effect';
import { WishListEffects } from './wish-list.effect';

import createSpy = jasmine.createSpy;

const userId = 'testUserId';
const cartName = 'name';
const cartDescription = 'description';
const wishListId = 'xxxx';
const customerId = '1234-5678-abcdef';

const testCart: Cart = {
  code: 'xxx',
  guid: 'testGuid',
  totalItems: 0,
  totalPrice: {
    currencyIso: 'USD',
    value: 0,
  },
  totalPriceWithTax: {
    currencyIso: 'USD',
    value: 0,
  },
};

const wishList: Cart = {
  code: wishListId,
  name: getWishlistName(customerId),
};

const saveCartResult: SaveCartResult = {
  savedCartData: {
    ...testCart,
    name: cartName,
    description: cartDescription,
    savedBy: { name: 'user', uid: userId },
  },
};

class MockCartConnector {
  create = createSpy().and.returnValue(of(testCart));
  load = createSpy().and.returnValue(of(wishList));
  loadAll(): Observable<Cart[]> {
    return of();
  }
}

class MockSaveCartConnector {
  saveCart = createSpy().and.returnValue(of(saveCartResult));
}

class MockUserIdService implements Partial<UserIdService> {
  getUserId = createSpy().and.returnValue(of(userId));
}

describe('Wish List Effect', () => {
  let actions$: Observable<any>;
  let wishListEffect: WishListEffects;
  let cartConnector: CartConnector;
  let store: Store<StateWithMultiCart>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(MULTI_CART_FEATURE, getMultiCartReducers()),
      ],
      providers: [
        { provide: CartConnector, useClass: MockCartConnector },
        { provide: SaveCartConnector, useClass: MockSaveCartConnector },
        { provide: UserIdService, useClass: MockUserIdService },
        fromEffects.WishListEffects,
        provideMockActions(() => actions$),
      ],
    });

    wishListEffect = TestBed.inject(WishListEffects);
    cartConnector = TestBed.inject(CartConnector);
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('createWishList$', () => {
    it('should create new cart and save it', () => {
      const action = new WishListActions.CreateWishList({
        userId,
        name: cartName,
        description: cartDescription,
      });

      const createWishListCompletion =
        new WishListActions.CreateWishListSuccess({
          cart: saveCartResult.savedCartData,
          userId,
        });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: createWishListCompletion });

      expect(wishListEffect.createWishList$).toBeObservable(expected);
    });
  });

  describe('loadWishList$', () => {
    it('should create wish list if it does NOT exist', () => {
      const payload = {
        userId,
        customerId,
        tempCartId: getWishlistName(customerId),
      };

      spyOn(cartConnector, 'loadAll').and.returnValue(of([testCart]));

      const action = new WishListActions.LoadWishList(payload);

      const createWishListAction = new WishListActions.CreateWishList({
        userId,
        name: getWishlistName(customerId),
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: createWishListAction });

      expect(wishListEffect.loadWishList$).toBeObservable(expected);
    });
    it('should dispatch load wish list success if it exists', () => {
      const payload = {
        userId,
        customerId,
        tempCartId: getWishlistName(customerId),
      };

      spyOn(cartConnector, 'loadAll').and.returnValue(of([testCart, wishList]));

      const action = new WishListActions.LoadWishList(payload);

      const loadWishListSuccessAction = new WishListActions.LoadWishListSuccess(
        {
          cart: wishList,
          userId,
          cartId: getCartIdByUserId(wishList, userId),
          tempCartId: getWishlistName(customerId),
          customerId,
        }
      );

      const removeCartAction = new CartActions.RemoveCart({
        cartId: getWishlistName(customerId),
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-(bc)', {
        b: loadWishListSuccessAction,
        c: removeCartAction,
      });

      expect(wishListEffect.loadWishList$).toBeObservable(expected);
    });
  });

  describe('resetWishList$', () => {
    it('should load wish list from id', () => {
      store.dispatch(
        new CartActions.SetCartTypeIndex({
          cartType: CartType.WISH_LIST,
          cartId: getCartIdByUserId(wishList, userId),
        })
      );

      const action = new SiteContextActions.CurrencyChange({
        previous: 'previous',
        current: 'current',
      });

      const resetWishListAction = new WishListActions.LoadWishListSuccess({
        cart: wishList,
        userId,
        cartId: getCartIdByUserId(wishList, userId),
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: resetWishListAction });

      expect(wishListEffect.resetWishList$).toBeObservable(expected);
    });
  });
});
