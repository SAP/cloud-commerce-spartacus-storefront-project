/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckoutState } from '@commerce-storefront-toolset/checkout/base/root';
import { Observable } from 'rxjs';

export abstract class CheckoutAdapter {
  /**
   * Abstract method used to get checkout details
   *
   * @param userId
   * @param cartId
   */
  abstract getCheckoutDetails(
    userId: string,
    cartId: string
  ): Observable<CheckoutState>;
}
