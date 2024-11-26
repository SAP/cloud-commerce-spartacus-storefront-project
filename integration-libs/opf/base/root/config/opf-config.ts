/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class OpfConfig {
  opf?: {
    opfBaseUrl?: string;
    commerceCloudPublicKey?: string;
    /**
     * The map of info message translation keys for specific payment configuration IDs
     * @example
     * ```ts
     * const opfConfig = {
     *   opf: {
     *     paymentInfoMessagesMap: {
     *       213: 'opfCheckout.payPalPaymentInfoMessage' // Message key for payment method ID 213
     *     }
     *   }
     * };
     * ```
     */
    paymentInfoMessagesMap?: Record<number, string>;
  };
}

declare module '@spartacus/core' {
  interface Config extends OpfConfig {}
}
