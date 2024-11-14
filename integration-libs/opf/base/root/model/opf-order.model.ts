/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Address, Occ, PaymentDetails } from '@spartacus/core';

export interface OpfOrder extends Occ.Order {}

export interface OpfOrder extends Omit<Occ.Order, 'paymentInfo'> {
  sapBillingAddress: Address;
  paymentInfo: Omit<PaymentDetails, 'billingAddress'>;
}
