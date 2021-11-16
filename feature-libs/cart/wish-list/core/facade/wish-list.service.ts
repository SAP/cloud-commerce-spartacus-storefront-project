import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateWithMultiCart } from '@spartacus/cart/main/core';
import {
  Cart,
  CartType,
  MultiCartFacade,
  OrderEntry,
} from '@spartacus/cart/main/root';
import { WishListFacade } from '@spartacus/cart/wish-list/root';
import {
  OCC_USER_ID_ANONYMOUS,
  UserIdService,
  UserService,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { WishListActions } from '../store/actions/index';
import { getWishlistName } from '../utils/utils';

@Injectable()
export class WishListService implements WishListFacade {
  constructor(
    protected store: Store<StateWithMultiCart>,
    protected userService: UserService,
    protected multiCartFacade: MultiCartFacade,
    protected userIdService: UserIdService
  ) {}

  createWishList(userId: string, name?: string, description?: string): void {
    this.store.dispatch(
      new WishListActions.CreateWishList({ userId, name, description })
    );
  }

  getWishList(): Observable<Cart> {
    return combineLatest([
      this.getWishListId(),
      this.userService.get(),
      this.userIdService.getUserId(),
    ]).pipe(
      distinctUntilChanged(),
      tap(([wishListId, user, userId]) => {
        if (
          !Boolean(wishListId) &&
          userId !== OCC_USER_ID_ANONYMOUS &&
          user?.customerId
        ) {
          this.loadWishList(userId, getWishlistName(user.customerId));
        }
      }),
      filter(([wishListId]) => Boolean(wishListId)),
      switchMap(([wishListId]) => this.multiCartFacade.getCart(wishListId))
    );
  }

  loadWishList(userId: string, cartId: string): void {
    this.store.dispatch(
      new WishListActions.LoadWishList({
        userId,
        cartId,
      })
    );
  }

  addEntry(productCode: string): void {
    this.prepareEntryAction().subscribe(([wishListId, userId]) =>
      this.multiCartFacade.addEntry(userId, wishListId, productCode, 1)
    );
  }

  removeEntry(entry: OrderEntry): void {
    this.prepareEntryAction().subscribe(([wishListId, userId]) =>
      this.multiCartFacade.removeEntry(
        userId,
        wishListId,
        entry.entryNumber as number
      )
    );
  }

  getWishListLoading(): Observable<boolean> {
    return this.getWishListId().pipe(
      switchMap((wishListId) =>
        this.multiCartFacade.isStable(wishListId).pipe(map((stable) => !stable))
      )
    );
  }

  protected getWishListId(): Observable<string> {
    return this.multiCartFacade.getCartIdByType(CartType.WISH_LIST);
  }

  private prepareEntryAction(): Observable<string[]> {
    return this.getWishListId().pipe(
      distinctUntilChanged(),
      withLatestFrom(this.userIdService.getUserId(), this.userService.get()),
      tap(([wishListId, userId, user]) => {
        if (!Boolean(wishListId) && user && user.customerId) {
          this.loadWishList(userId, getWishlistName(user.customerId));
        }
      }),
      filter(([wishListId]) => Boolean(wishListId)),
      map(([wishListId, userId]) => [wishListId, userId]),
      take(1)
    );
  }
}
