import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { CartModification } from '@spartacus/cart/base/root';
import { SiteContextActions, withdrawOn } from '@spartacus/core';
import { CartEntryGroupConnector } from '../../connectors/entry-group';
import { CartActions } from '../actions/index';

@Injectable()
export class CartEntryGroupEffects {
  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  addToEntryGroup$: Observable<
    | CartActions.AddToEntryGroupSuccess
    | CartActions.AddToEntryGroupFail
    | CartActions.LoadCart
  > = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.ADD_TO_ENTRY_GROUP),
      map((action: CartActions.AddToEntryGroup) => action.payload),
      concatMap((payload) =>
        this.cartEntryGroupConnector
          .addToEntryGroup(
            payload.userId,
            payload.cartId,
            payload.entryGroupNumber,
            payload.entry
          )
          .pipe(
            map((cartModification: CartModification) => {
              return new CartActions.AddToEntryGroupSuccess({
                ...payload,
                ...(cartModification as Required<CartModification>),
              });
            }),
            catchError((error) =>
              from([
                new CartActions.AddToEntryGroupFail({
                  ...payload,
                  error: error,
                }),
                new CartActions.LoadCart({
                  cartId: payload.cartId,
                  userId: payload.userId,
                }),
              ])
            )
          )
      ),
      withdrawOn(this.contextChange$)
    )
  );

  deleteEntryGroup$: Observable<
    | CartActions.DeleteEntryGroupSuccess
    | CartActions.DeleteEntryGroupFail
    | CartActions.LoadCart
  > = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.DELETE_ENTRY_GROUP),
      map((action: CartActions.DeleteEntryGroup) => action.payload),
      concatMap((payload) =>
        this.cartEntryGroupConnector
          .deleteEntryGroup(
            payload.userId,
            payload.cartId,
            payload.entryGroupNumber
          )
          .pipe(
            map(() => {
              return new CartActions.DeleteEntryGroupSuccess({
                ...payload,
              });
            }),
            catchError((error) =>
              from([
                new CartActions.DeleteEntryGroupFail({
                  ...payload,
                  error: error,
                }),
                new CartActions.LoadCart({
                  cartId: payload.cartId,
                  userId: payload.userId,
                }),
              ])
            )
          )
      ),
      withdrawOn(this.contextChange$)
    )
  );

  // TODO: Switch to automatic cart reload on processes count reaching 0 for cart entity
  refreshWithoutProcesses$: Observable<CartActions.LoadCart> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.ADD_TO_ENTRY_GROUP_SUCCESS,
          CartActions.DELETE_ENTRY_GROUP_SUCCESS
        ),
        map(
          (
            action:
              | CartActions.AddToEntryGroupSuccess
              | CartActions.DeleteEntryGroupSuccess
          ) => action.payload
        ),
        map((payload) => {
          console.log('reloading');
          return new CartActions.LoadCart({
            userId: <string>payload.userId,
            cartId: <string>payload.cartId,
          });
        })
      )
  );

  constructor(
    private actions$: Actions,
    private cartEntryGroupConnector: CartEntryGroupConnector
  ) {}
}
