/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpfPaymentMethodDetails } from '@spartacus/opf/payment/root';

declare module '@spartacus/core' {
  interface PaymentDetails {
    sapPaymentMethod?: OpfPaymentMethodDetails;
  }
}
