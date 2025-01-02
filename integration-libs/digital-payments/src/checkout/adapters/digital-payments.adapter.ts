/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Address, PaymentDetails } from '@spartacus/core';
import { Observable } from 'rxjs';
import { DpPaymentRequest } from '../models';

export abstract class DigitalPaymentsAdapter {
  abstract createPaymentRequest(
    userId?: string,
    cartId?: string
  ): Observable<DpPaymentRequest>;
  abstract createPaymentDetails(
    sessionId: string,
    signature: string,
    userId?: string,
    cartId?: string,
    billingAddress?: Address
  ): Observable<PaymentDetails>;
}
