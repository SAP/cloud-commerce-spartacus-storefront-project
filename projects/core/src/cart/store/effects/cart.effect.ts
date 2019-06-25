import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Cart } from '../../../model/cart.model';
import * as fromSiteContextActions from '../../../site-context/store/actions/index';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { CartConnector } from '../../connectors/cart/cart.connector';
import { CartDataService } from '../../facade/cart-data.service';
import * as fromEntryActions from '../actions/cart-entry.action';
import * as fromActions from './../actions/cart.action';

@Injectable()
export class CartEffects {
  @Effect()
  loadCart$: Observable<
    fromActions.LoadCartFail | fromActions.LoadCartSuccess
  > = this.actions$.pipe(
    ofType(fromActions.LOAD_CART),
    map(
      (action: {
        type: string;
        payload?: { userId: string; cartId: string };
      }) => action.payload
    ),
    mergeMap(payload => {
      const loadCartParams = {
        userId: (payload && payload.userId) || this.cartData.userId,
        cartId: (payload && payload.cartId) || this.cartData.cartId,
      };

      if (this.isMissingData(loadCartParams)) {
        return of(new fromActions.LoadCartFail({}));
      }
      return this.cartConnector
        .load(loadCartParams.userId, loadCartParams.cartId)
        .pipe(
          map((cart: Cart) => {
            return new fromActions.LoadCartSuccess(cart);
          }),
          catchError(error =>
            of(new fromActions.LoadCartFail(makeErrorSerializable(error)))
          )
        );
    })
  );

  @Effect()
  createCart$: Observable<
    | fromActions.MergeCartSuccess
    | fromActions.CreateCartSuccess
    | fromActions.CreateCartFail
  > = this.actions$.pipe(
    ofType(fromActions.CREATE_CART),
    map((action: fromActions.CreateCart) => action.payload),
    mergeMap(payload => {
      return this.cartConnector
        .create(payload.userId, payload.oldCartId, payload.toMergeCartGuid)
        .pipe(
          switchMap((cart: Cart) => {
            if (payload.oldCartId) {
              return [
                new fromActions.CreateCartSuccess(cart),
                new fromActions.MergeCartSuccess({
                  userId: payload.userId,
                  cartId: cart.code,
                }),
              ];
            }
            return [new fromActions.CreateCartSuccess(cart)];
          }),
          catchError(error =>
            of(new fromActions.CreateCartFail(makeErrorSerializable(error)))
          )
        );
    })
  );

  @Effect()
  mergeCart$: Observable<fromActions.CreateCart> = this.actions$.pipe(
    ofType(fromActions.MERGE_CART),
    map((action: fromActions.MergeCart) => action.payload),
    mergeMap(payload => {
      return this.cartConnector.load(payload.userId, 'current').pipe(
        map(currentCart => {
          return new fromActions.CreateCart({
            userId: payload.userId,
            oldCartId: payload.cartId,
            toMergeCartGuid: currentCart ? currentCart.guid : undefined,
          });
        })
      );
    })
  );

  @Effect()
  refresh$: Observable<fromActions.LoadCart> = this.actions$.pipe(
    ofType(
      fromActions.MERGE_CART_SUCCESS,
      fromEntryActions.ADD_ENTRY_SUCCESS,
      fromEntryActions.UPDATE_ENTRY_SUCCESS,
      fromEntryActions.REMOVE_ENTRY_SUCCESS
    ),
    map(
      (
        action:
          | fromActions.MergeCartSuccess
          | fromEntryActions.AddEntrySuccess
          | fromEntryActions.UpdateEntrySuccess
          | fromEntryActions.RemoveEntrySuccess
      ) => action.payload
    ),
    map(
      payload =>
        new fromActions.LoadCart({
          userId: payload.userId,
          cartId: payload.cartId,
        })
    )
  );

  @Effect()
  resetCartDetailsOnSiteContextChange$: Observable<
    fromActions.ResetCartDetails
  > = this.actions$.pipe(
    ofType(
      fromSiteContextActions.LANGUAGE_CHANGE,
      fromSiteContextActions.CURRENCY_CHANGE
    ),
    map(() => new fromActions.ResetCartDetails())
  );

  constructor(
    private actions$: Actions,
    private cartConnector: CartConnector,
    private cartData: CartDataService
  ) {}

  private isMissingData(payload) {
    return payload.userId === undefined || payload.cartId === undefined;
  }
}
