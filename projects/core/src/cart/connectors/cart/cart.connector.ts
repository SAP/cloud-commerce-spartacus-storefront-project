import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CartAdapter } from './cart.adapter';
import { UICart } from '../../model/cart';
import { CheckoutDetails } from '../../../checkout/models/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CartConnector {
  constructor(private adapter: CartAdapter) {}

  public loadAll(userId: string, details?: boolean): Observable<UICart[]> {
    return this.adapter.loadAll(userId, details);
  }

  public load(
    userId: string,
    cartId: string,
    details?: boolean
  ): Observable<UICart> {
    return this.adapter.load(userId, cartId, details);
  }

  public loadCheckoutDetails(
    userId: string,
    cartId: string
  ): Observable<CheckoutDetails> {
    return this.adapter.loadCheckoutDetails(userId, cartId);
  }

  public create(
    userId: string,
    oldCartId?: string,
    toMergeCartGuid?: string
  ): Observable<UICart> {
    return this.adapter.create(userId, oldCartId, toMergeCartGuid);
  }
}
