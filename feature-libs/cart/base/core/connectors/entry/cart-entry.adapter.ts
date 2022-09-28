/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AddEntryAdapterOptions,
  CartModification,
  RemoveEntryAdapterOptions,
  UpdateEntryAdapterOptions,
} from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';

export abstract class CartEntryAdapter {
  /**
   * Abstract method used to add entry to cart
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `add(options: AddEntryAdapterOptions)`.
   *
   * @param userId
   * @param cartId
   * @param productCode
   * @param quantity
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract add(
    userId: string,
    cartId: string,
    productCode: string,
    quantity?: number
  ): Observable<CartModification>;
  /**
   * Abstract method used to add entry to cart
   */
  abstract add(options: AddEntryAdapterOptions): Observable<CartModification>;

  /**
   * Abstract method used to update entry in cart
   * @param userId
   * @param cartId
   * @param entryNumber
   * @param qty
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `update(options: UpdateEntryAdapterOptions)`.
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract update(
    userId: string,
    cartId: string,
    entryNumber: string | number,
    qty: number,
    pickupStore?: string
  ): Observable<CartModification>;
  /**
   * Abstract method used to update entry in cart
   */
  abstract update(
    options: UpdateEntryAdapterOptions
  ): Observable<CartModification>;

  /**
   * Abstract method used to remove entry from cart
   *
   * @param userId
   * @param cartId
   * @param entryNumber
   *
   * @deprecated since 5.1.0, and will be removed in the future major version.
   * Instead, use `remove(options: RemoveEntryAdapterOptions)`.
   */
  // TODO:#object-extensibility-deprecation - remove
  abstract remove(
    userId: string,
    cartId: string,
    entryNumber: string | number
  ): Observable<any>;
  /**
   * Abstract method used to remove entry from cart
   */
  abstract remove(options: RemoveEntryAdapterOptions): Observable<any>;
}
