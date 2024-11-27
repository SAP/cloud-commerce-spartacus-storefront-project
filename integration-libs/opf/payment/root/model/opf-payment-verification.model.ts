/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpfKeyValueMap } from '@spartacus/opf/base/root';

export interface OpfPaymentVerificationPayload {
  responseMap: Array<OpfKeyValueMap>;
}

export interface OpfPaymentVerificationResponse {
  result: string;
}

export enum OpfPaymentVerificationResult {
  AUTHORIZED = 'AUTHORIZED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
}

export enum OpfPaymentVerificationUrlInput {
  PAYMENT_SESSION_ID = 'paymentSessionId',
  ORDER_ID = 'orderId',
}
