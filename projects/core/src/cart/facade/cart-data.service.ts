import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/facade/auth.service';
import { Cart } from '../../model/cart.model';
import { StateWithCart } from '../store/cart-state';
import { CartSelectors } from '../store/selectors/index';
import { OCC_USER_ID_ANONYMOUS } from '../../occ/utils/occ-constants';

@Injectable()
export class CartDataService {
  private _userId = OCC_USER_ID_ANONYMOUS;
  private _cart: Cart;

  constructor(
    protected store: Store<StateWithCart>,
    protected authService: AuthService
  ) {
    this.authService
      .getUserToken()
      .pipe(filter(userToken => this.userId !== userToken.userId))
      .subscribe(userToken => {
        if (Object.keys(userToken).length !== 0) {
          this._userId = userToken.userId;
        } else {
          this._userId = OCC_USER_ID_ANONYMOUS;
        }
      });

    this.store.pipe(select(CartSelectors.getCartContent)).subscribe(cart => {
      this._cart = cart;
    });
  }

  get hasCart(): boolean {
    return !!this._cart && Object.keys(this._cart).length > 0;
  }

  get userId(): string {
    return this._userId;
  }

  get cart(): Cart {
    return this._cart;
  }

  get cartId(): string {
    if (this.hasCart) {
      return this.userId === OCC_USER_ID_ANONYMOUS
        ? this.cart.guid
        : this.cart.code;
    }
  }
}
