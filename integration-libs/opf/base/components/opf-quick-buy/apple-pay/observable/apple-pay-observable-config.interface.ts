/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';

export interface ApplePayAuthorizationResult {
  authResult: ApplePayJS.ApplePayPaymentAuthorizationResult;
  payment: ApplePayJS.ApplePayPayment;
}

export interface ApplePayObservableConfig {
  request: ApplePayJS.ApplePayPaymentRequest;
  validateMerchant: (
    event: ApplePayJS.ApplePayValidateMerchantEvent
  ) => Observable<any>;
  shippingContactSelected: (
    event: ApplePayJS.ApplePayShippingContactSelectedEvent
  ) => Observable<ApplePayJS.ApplePayShippingContactUpdate>;
  paymentMethodSelected: (
    event: ApplePayJS.ApplePayPaymentMethodSelectedEvent
  ) => Observable<ApplePayJS.ApplePayPaymentMethodUpdate>;
  shippingMethodSelected: (
    event: ApplePayJS.ApplePayShippingMethodSelectedEvent
  ) => Observable<ApplePayJS.ApplePayShippingMethodUpdate>;
  paymentAuthorized: (
    event: ApplePayJS.ApplePayPaymentAuthorizedEvent
  ) => Observable<ApplePayJS.ApplePayPaymentAuthorizationResult>;
}
