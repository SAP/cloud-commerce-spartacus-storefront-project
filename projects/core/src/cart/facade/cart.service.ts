import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { AuthService, UserToken } from '../../auth/index';
import { Cart } from '../../model/cart.model';
import { OrderEntry } from '../../model/order.model';
import { BaseSiteService } from '../../site-context/index';
import * as fromCartActions from '../store/actions/index';
import { StateWithCart } from '../store/cart-state';
import { CartSelectors } from '../store/selectors/index';
import { ANONYMOUS_USERID, CartDataService } from './cart-data.service';

@Injectable()
export class CartService {
  constructor(
    protected store: Store<StateWithCart>,
    protected cartData: CartDataService,
    protected authService: AuthService,
    protected baseSiteService: BaseSiteService
  ) {
    this.init();
  }

  getActive(): Observable<Cart> {
    return this.store.pipe(select(CartSelectors.getCartContent));
  }

  getEntries(): Observable<OrderEntry[]> {
    return this.store.pipe(select(CartSelectors.getCartEntries));
  }

  getCartMergeComplete(): Observable<boolean> {
    return this.store.pipe(select(CartSelectors.getCartMergeComplete));
  }

  getLoaded(): Observable<boolean> {
    return this.store.pipe(select(CartSelectors.getCartLoaded));
  }

  protected init(): void {
    this.store.pipe(select(CartSelectors.getCartContent)).subscribe(cart => {
      this.cartData.cart = cart;
    });

    combineLatest([
      this.baseSiteService.getActive(),
      this.authService.getUserToken(),
    ])
      .pipe(
        filter(([, userToken]) => this.cartData.userId !== userToken.userId)
      )
      .subscribe(([, userToken]) => {
        this.setUserId(userToken);
        this.loadOrMerge();
      });

    this.refresh();
  }

  protected setUserId(userToken: UserToken): void {
    if (Object.keys(userToken).length !== 0) {
      this.cartData.userId = userToken.userId;
    } else {
      this.cartData.userId = ANONYMOUS_USERID;
    }
  }

  protected loadOrMerge(): void {
    this.cartData.getDetails = true;
    // for login user, whenever there's an existing cart, we will load the user
    // current cart and merge it into the existing cart
    if (this.cartData.userId !== ANONYMOUS_USERID) {
      if (!this.isCreated(this.cartData.cart)) {
        this.store.dispatch(
          new fromCartActions.LoadCart({
            userId: this.cartData.userId,
            cartId: 'current',
          })
        );
      } else {
        this.store.dispatch(
          new fromCartActions.MergeCart({
            userId: this.cartData.userId,
            cartId: this.cartData.cart.guid,
          })
        );
      }
    }
  }

  protected refresh(): void {
    this.store.pipe(select(CartSelectors.getCartRefresh)).subscribe(refresh => {
      if (refresh) {
        this.store.dispatch(
          new fromCartActions.LoadCart({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            details: true,
          })
        );
      }
    });
  }

  loadDetails(): void {
    this.cartData.getDetails = true;

    if (this.cartData.userId !== ANONYMOUS_USERID) {
      this.store.dispatch(
        new fromCartActions.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId ? this.cartData.cartId : 'current',
          details: true,
        })
      );
    } else if (this.cartData.cartId) {
      this.store.dispatch(
        new fromCartActions.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          details: true,
        })
      );
    }
  }

  addEntry(productCode: string, quantity: number): void {
    this.store
      .pipe(
        select(CartSelectors.getActiveCartState),
        tap(cartState => {
          if (!this.isCreated(cartState.value.content) && !cartState.loading) {
            this.store.dispatch(
              new fromCartActions.CreateCart({ userId: this.cartData.userId })
            );
          }
        }),
        filter(cartState => this.isCreated(cartState.value.content)),
        take(1)
      )
      .subscribe(_ => {
        this.store.dispatch(
          new fromCartActions.AddEntry({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            productCode: productCode,
            quantity: quantity,
          })
        );
      });
  }

  removeEntry(entry: OrderEntry): void {
    this.store.dispatch(
      new fromCartActions.RemoveEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        entry: entry.entryNumber,
      })
    );
  }

  updateEntry(entryNumber: string, quantity: number): void {
    if (+quantity > 0) {
      this.store.dispatch(
        new fromCartActions.UpdateEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
          qty: quantity,
        })
      );
    } else {
      this.store.dispatch(
        new fromCartActions.RemoveEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
        })
      );
    }
  }

  getEntry(productCode: string): Observable<OrderEntry> {
    return this.store.pipe(
      select(CartSelectors.getCartEntrySelectorFactory(productCode))
    );
  }

  isCreated(cart: Cart): boolean {
    return cart && !!Object.keys(cart).length;
  }

  isEmpty(cart: Cart): boolean {
    return cart && !cart.totalItems;
  }
}
