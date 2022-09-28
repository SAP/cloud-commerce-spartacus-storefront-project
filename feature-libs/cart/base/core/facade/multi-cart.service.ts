/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  AddEntriesMultiCartFacadeOptions,
  AddEntryMultiCartFacadeOptions,
  Cart,
  CartType,
  MultiCartFacade,
  OrderEntry,
  RemoveEntryMultiCartFacadeOptions,
  UpdateEntryMultiCartFacadeOptions,
} from '@spartacus/cart/base/root';
import { isNotUndefined, StateUtils, UserIdService } from '@spartacus/core';
import { EMPTY, Observable, timer } from 'rxjs';
import {
  debounce,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { CartActions } from '../store/actions/index';
import { StateWithMultiCart } from '../store/multi-cart-state';
import { MultiCartSelectors } from '../store/selectors/index';

@Injectable()
export class MultiCartService implements MultiCartFacade {
  constructor(
    protected store: Store<StateWithMultiCart>,
    protected userIdService: UserIdService
  ) {}

  /**
   * Returns cart from store as an observable
   *
   * @param cartId
   */
  getCart(cartId: string): Observable<Cart> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartSelectorFactory(cartId))
    );
  }

  /**
   * Returns a list of carts from store as an observable
   *
   */
  getCarts(): Observable<Cart[]> {
    return this.store.pipe(select(MultiCartSelectors.getCartsSelectorFactory));
  }

  /**
   * Returns cart entity from store (cart with loading, error, success flags) as an observable
   *
   * @param cartId
   */
  getCartEntity(
    cartId: string
  ): Observable<StateUtils.ProcessesLoaderState<Cart | undefined>> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartEntitySelectorFactory(cartId))
    );
  }

  /**
   * Returns true when there are no operations on that in progress and it is not currently loading
   *
   * @param cartId
   */
  isStable(cartId: string): Observable<boolean> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartIsStableSelectorFactory(cartId)),
      // We dispatch a lot of actions just after finishing some process or loading, so we want this flag not to flicker.
      // This flickering should only be avoided when switching from false to true
      // Start of loading should be showed instantly (no debounce)
      // Extra actions are only dispatched after some loading
      debounce((isStable) => (isStable ? timer(0) : EMPTY)),
      distinctUntilChanged()
    );
  }

  /**
   * Simple random temp cart id generator
   */
  protected generateTempCartId(): string {
    const pseudoUuid = Math.random().toString(36).substr(2, 9);
    return `temp-${pseudoUuid}`;
  }

  /**
   * Create or merge cart
   *
   * @param params Object with userId, oldCartId, toMergeCartGuid and extraData
   */
  createCart({
    userId,
    oldCartId,
    toMergeCartGuid,
    extraData,
  }: {
    userId: string;
    oldCartId?: string;
    toMergeCartGuid?: string;
    extraData?: {
      active?: boolean;
    };
  }): Observable<Cart> {
    // to support creating multiple carts at the same time we need to use different entity for every process
    // simple random uuid generator is used here for entity names
    const tempCartId = this.generateTempCartId();
    this.store.dispatch(
      new CartActions.CreateCart({
        extraData,
        userId,
        oldCartId,
        toMergeCartGuid,
        tempCartId,
      })
    );

    return this.getCartIdByType(
      extraData?.active ? CartType.ACTIVE : CartType.NEW_CREATED
    ).pipe(
      switchMap((cartId) => this.getCart(cartId)),
      filter(isNotUndefined)
    );
  }

  /**
   * Merge provided cart to current user cart
   *
   * @param params Object with userId, cartId and extraData
   */
  mergeToCurrentCart({
    userId,
    cartId,
    extraData,
  }: {
    userId: string;
    cartId: string;
    extraData?: {
      active?: boolean;
    };
  }) {
    const tempCartId = this.generateTempCartId();
    this.store.dispatch(
      new CartActions.MergeCart({
        userId,
        cartId,
        extraData,
        tempCartId,
      })
    );
  }

  /**
   * Load cart
   *
   * @param params Object with userId, cartId and extraData
   */
  loadCart({
    cartId,
    userId,
    extraData,
  }: {
    cartId: string;
    userId: string;
    extraData?: any;
  }): void {
    this.store.dispatch(
      new CartActions.LoadCart({
        userId,
        cartId,
        extraData,
      })
    );
  }

  /**
   * Get cart entries as an observable
   * @param cartId
   */
  getEntries(cartId: string): Observable<OrderEntry[]> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartEntriesSelectorFactory(cartId))
    );
  }

  /**
   * Get last entry for specific product code from cart.
   * Needed to cover processes where multiple entries can share the same product code
   * (e.g. promotions or configurable products)
   *
   * @param cartId
   * @param productCode
   */
  getLastEntry(
    cartId: string,
    productCode: string
  ): Observable<OrderEntry | undefined> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartEntriesSelectorFactory(cartId)),
      map((entries) => {
        const filteredEntries = entries.filter(
          (entry) => entry.product?.code === productCode
        );
        return filteredEntries
          ? filteredEntries[filteredEntries.length - 1]
          : undefined;
      })
    );
  }

  /**
   * Add entry to cart
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `addEntry(options: AddEntryMultiCartFacadeOptions)`.
   *
   * @param userId
   * @param cartId
   * @param productCode
   * @param quantity
   */
  // TODO:#object-extensibility-deprecation - remove
  addEntry(
    userId: string,
    cartId: string,
    productCode: string,
    quantity: number
  ): void;
  // TODO:#object-extensibility-deprecation - remove
  addEntry(options: AddEntryMultiCartFacadeOptions): void;
  addEntry(
    // TODO:#object-extensibility-deprecation - rename to `options`
    optionsOrUserId:
      | AddEntryMultiCartFacadeOptions
      // TODO:#object-extensibility-deprecation - remove the `| string`
      | string,
    // TODO:#object-extensibility-deprecation - remove the rest of params
    cartId?: string,
    productCode?: string,
    quantity?: number
  ): void {
    // TODO:#object-extensibility-deprecation - remove the whole 'if' statement
    if (typeof optionsOrUserId === 'string') {
      const userId = optionsOrUserId;
      this.store.dispatch(
        new CartActions.CartAddEntry({
          options: {
            userId,
            cartId: cartId ?? '',
            productCode: productCode ?? '',
            quantity,
          },
        })
      );

      return;
    }

    this.store.dispatch(
      new CartActions.CartAddEntry({
        options: optionsOrUserId,
      })
    );
  }

  // TODO:#object-extensibility-deprecation - remove
  /**
   * Add multiple entries to cart
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `addEntries(userId: string,cartId: string,options: AddEntryOptions[])`.
   *
   * @param userId
   * @param cartId
   * @param products Array with items (productCode and quantity)
   */
  addEntries(
    userId: string,
    cartId: string,
    products: Array<{ productCode: string; quantity: number }>
  ): void;
  // TODO:#object-extensibility-deprecation - remove
  addEntries(options: AddEntriesMultiCartFacadeOptions): void;
  /**
   * Add multiple entries to cart
   */
  addEntries(
    // TODO:#object-extensibility-deprecation - rename to `options`
    optionsOrUserId:
      | AddEntriesMultiCartFacadeOptions
      // TODO:#object-extensibility-deprecation - remove
      | string,
    // TODO:#object-extensibility-deprecation - remove the rest of params
    cartId?: string,
    products?: Array<{ productCode: string; quantity: number }>
  ): void {
    if (typeof optionsOrUserId === 'string') {
      (products ?? []).forEach((product) => {
        this.store.dispatch(
          new CartActions.CartAddEntry({
            userId: optionsOrUserId,
            cartId: cartId ?? '',
            productCode: product.productCode,
            quantity: product.quantity,
          })
        );
      });
      return;
    }

    optionsOrUserId.entries.forEach((entry) => {
      this.store.dispatch(
        new CartActions.CartAddEntry({
          options: {
            userId: optionsOrUserId.userId,
            cartId: optionsOrUserId.cartId,
            ...entry,
          },
        })
      );
    });
  }

  /**
   * Remove entry from cart
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `removeEntry(options: RemoveEntryMultiCartFacadeOptions)`.
   *
   * @param userId
   * @param cartId
   * @param entryNumber
   */
  // TODO:#object-extensibility-deprecation - remove
  removeEntry(userId: string, cartId: string, entryNumber: number): void;
  // TODO:#object-extensibility-deprecation - remove
  removeEntry(options: RemoveEntryMultiCartFacadeOptions): void;
  removeEntry(
    // TODO:#object-extensibility-deprecation - rename to `options`
    optionsOrUserId:
      | RemoveEntryMultiCartFacadeOptions
      // TODO:#object-extensibility-deprecation - remove the `| string`
      | string,
    // TODO:#object-extensibility-deprecation - remove the rest of params
    cartId?: string,
    entryNumber?: number
  ): void {
    // TODO:#object-extensibility-deprecation - remove the whole 'if' statement
    if (typeof optionsOrUserId === 'string') {
      this.store.dispatch(
        new CartActions.CartRemoveEntry({
          options: {
            userId: optionsOrUserId,
            cartId: cartId ?? '',
            entryNumber: entryNumber || 0,
          },
        })
      );

      return;
    }

    this.store.dispatch(
      new CartActions.CartRemoveEntry({
        options: optionsOrUserId,
      })
    );
  }

  /**
   * Update entry in cart. For quantity = 0 it removes entry
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `updateEntry(options: UpdateEntryMultiCartFacadeOptions)`.
   *
   * @param userId
   * @param cartId
   * @param entryNumber
   * @param quantity
   */
  // TODO:#object-extensibility-deprecation - remove
  updateEntry(
    userId: string,
    cartId: string,
    entryNumber: number,
    quantity: number
  ): void;
  // TODO:#object-extensibility-deprecation - remove
  updateEntry(options: UpdateEntryMultiCartFacadeOptions): void;
  updateEntry(
    // TODO:#object-extensibility-deprecation - rename to `options`
    optionsOrUserId:
      | UpdateEntryMultiCartFacadeOptions
      // TODO:#object-extensibility-deprecation - remove the `| string`
      | string,
    cartId?: string,
    entryNumber?: number,
    quantity?: number
  ): void {
    // TODO:#object-extensibility-deprecation - remove the whole 'if' statement
    if (typeof optionsOrUserId === 'string') {
      quantity = quantity || 1;
      const userId = optionsOrUserId;
      if (quantity > 0) {
        this.store.dispatch(
          new CartActions.CartUpdateEntry({
            options: {
              userId,
              cartId: cartId ?? '',
              entryNumber: entryNumber || 1,
              quantity,
            },
          })
        );
      } else {
        this.removeEntry(userId, cartId ?? '', entryNumber ?? 1);
      }

      return;
    }

    if (optionsOrUserId.quantity || 0 > 0) {
      this.store.dispatch(
        new CartActions.CartUpdateEntry({
          options: optionsOrUserId,
        })
      );
    } else {
      this.removeEntry(optionsOrUserId);
    }
  }

  /**
   * Get first entry from cart matching the specified product code
   *
   * @param cartId
   * @param productCode
   */
  getEntry(
    cartId: string,
    productCode: string
  ): Observable<OrderEntry | undefined> {
    return this.store.pipe(
      select(
        MultiCartSelectors.getCartEntrySelectorFactory(cartId, productCode)
      )
    );
  }

  /**
   * Assign email to the cart
   *
   * @param cartId
   * @param userId
   * @param email
   */
  assignEmail(cartId: string, userId: string, email: string): void {
    this.store.dispatch(
      new CartActions.AddEmailToCart({
        userId,
        cartId,
        email,
      })
    );
  }

  removeCart(cartId: string): void {
    this.store.dispatch(new CartActions.RemoveCart({ cartId }));
  }

  /**
   * Delete cart
   *
   * @param cartId
   * @param userId
   */
  deleteCart(cartId: string, userId: string): void {
    this.store.dispatch(
      new CartActions.DeleteCart({
        userId,
        cartId,
      })
    );
  }

  /**
   * Reloads the cart with specified id.
   *
   * @param cartId
   * @param extraData
   */
  reloadCart(cartId: string, extraData?: { active: boolean }): void {
    this.userIdService.takeUserId().subscribe((userId) =>
      this.store.dispatch(
        new CartActions.LoadCart({
          userId,
          cartId,
          extraData,
        })
      )
    );
  }

  /**
   * Get the cart id based on cart type
   *
   * @param cartType
   */
  getCartIdByType(cartType: CartType): Observable<string> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartIdByTypeFactory(cartType)),
      distinctUntilChanged()
    );
  }
}
