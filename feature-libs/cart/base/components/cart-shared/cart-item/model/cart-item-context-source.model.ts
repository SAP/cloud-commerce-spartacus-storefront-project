import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CartItemComponentOptions,
  CartItemContext,
  OrderEntry,
  PromotionLocation,
} from '@spartacus/cart/base/root';
import { ReplaySubject } from 'rxjs';

/**
 * Context source for `CartItemComponent`.
 *
 * `CartItemContext` should be injected instead in child components.
 */
@Injectable()
export class CartItemContextSource implements CartItemContext {
  readonly compact$ = new ReplaySubject<boolean>(1);

  readonly readonly$ = new ReplaySubject<boolean>(1);

  readonly item$ = new ReplaySubject<OrderEntry>(1);

  readonly quantityControl$ = new ReplaySubject<FormControl>(1);

  readonly location$ = new ReplaySubject<PromotionLocation>(1);

  readonly options$ = new ReplaySubject<CartItemComponentOptions>(1);
}
