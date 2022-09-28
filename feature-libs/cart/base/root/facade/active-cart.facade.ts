/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { facadeFactory, User } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CART_BASE_CORE_FEATURE } from '../feature-name';
import {
  AddEntriesActiveCartFacadeOptions,
  AddEntryActiveCartFacadeOptions,
  Cart,
  OrderEntry,
  RemoveEntryActiveCartFacadeOptions,
  UpdateEntryActiveCartFacadeOptions,
} from '../models/cart.model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: ActiveCartFacade,
      feature: CART_BASE_CORE_FEATURE,
      methods: [
        'getActive',
        'takeActive',
        'getActiveCartId',
        'takeActiveCartId',
        'getEntries',
        'getLastEntry',
        'getLoading',
        'isStable',
        'addEntry',
        'removeEntry',
        'updateEntry',
        'getEntry',
        'addEmail',
        'getAssignedUser',
        'isGuestCart',
        'addEntries',
        'requireLoadedCart',
        'reloadActiveCart',
      ],
      async: true,
    }),
})
export abstract class ActiveCartFacade {
  /**
   * Returns active cart
   */
  abstract getActive(): Observable<Cart>;

  /**
   * Waits for the cart to be stable before returning the active cart.
   */
  abstract takeActive(): Observable<Cart>;

  /**
   * Returns active cart id
   */
  abstract getActiveCartId(): Observable<string>;

  /**
   * Waits for the cart to be stable before returning the active cart's ID.
   */
  abstract takeActiveCartId(): Observable<string>;

  /**
   * Returns cart entries
   */
  abstract getEntries(): Observable<OrderEntry[]>;

  /**
   * Returns last cart entry for provided product code.
   * Needed to cover processes where multiple entries can share the same product code
   * (e.g. promotions or configurable products)
   *
   * @param productCode
   */
  abstract getLastEntry(
    productCode: string
  ): Observable<OrderEntry | undefined>;

  /**
   * Returns cart loading state
   */
  abstract getLoading(): Observable<boolean>;

  /**
   * Returns true when cart is stable (not loading and not pending processes on cart)
   */
  abstract isStable(): Observable<boolean>;

  /**
   * Add entry to active cart
   *
   * @param productCode
   * @param quantity
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `addEntry(options: AddEntryActiveCartFacadeOptions)`.
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract addEntry(productCode: string, quantity: number): void;
  /**
   * Add entry to active cart
   */
  abstract addEntry(options: AddEntryActiveCartFacadeOptions): void;

  /**
   * Remove entry
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `removeEntry(options: RemoveEntryActiveCartFacadeOptions)`.
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract removeEntry(entry: OrderEntry): void;
  /**
   * Remove entry
   */
  // TODO:#object-extensibility-deprecation - remove the eslint on the next line
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  abstract removeEntry(options: RemoveEntryActiveCartFacadeOptions): void;

  /**
   * Update entry
   *
   * @param entryNumber
   * @param quantity
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `update(options: UpdateEntryActiveCartFacadeOptions)`.
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract updateEntry(entryNumber: number, quantity: number): void;
  /**
   * Update entry
   */
  abstract updateEntry(options: UpdateEntryActiveCartFacadeOptions): void;

  /**
   * Returns cart entry
   *
   * @param productCode
   */
  abstract getEntry(productCode: string): Observable<OrderEntry | undefined>;

  /**
   * Assign email to cart
   *
   * @param email
   */
  abstract addEmail(email: string): void;

  /**
   * Get assigned user to cart
   */
  abstract getAssignedUser(): Observable<User>;

  /**
   * Returns observable of true for guest cart
   */
  abstract isGuestCart(cart?: Cart): Observable<boolean>;

  /**
   * Add multiple entries to a cart
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `addEntries(options: AddEntriesActiveCartFacadeOptions)`.
   *
   * @param cartEntries : list of entries to add (OrderEntry[])
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract addEntries(cartEntries: OrderEntry[]): void;
  // TODO:#object-extensibility-deprecation - remove the lint rule
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  abstract addEntries(options: AddEntriesActiveCartFacadeOptions): void;

  abstract requireLoadedCart(forGuestMerge?: boolean): Observable<Cart>;

  abstract reloadActiveCart(): void;
}
