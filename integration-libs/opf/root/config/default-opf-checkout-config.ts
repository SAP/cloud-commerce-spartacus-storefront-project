/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CheckoutConfig,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';

export const defaultOPFCheckoutConfig: CheckoutConfig = {
  checkout: {
    steps: [
      {
        id: 'deliveryAddress',
        name: 'opf.checkout.tabs.shipping',
        routeName: 'checkoutDeliveryAddress',
        type: [CheckoutStepType.DELIVERY_ADDRESS],
        nameMultiLine: false,
      },
      {
        id: 'deliveryMode',
        name: 'opf.checkout.tabs.deliveryMethod',
        routeName: 'checkoutDeliveryMode',
        type: [CheckoutStepType.DELIVERY_MODE],
        nameMultiLine: false,
      },
      {
        id: 'reviewOrder',
        name: 'opf.checkout.tabs.paymentAndReview',
        routeName: 'checkoutReviewOrder',
        // TODO: (OPF) provide proper step type (PAYMENT_REVIEW) once augmenting problem is solved
        type: [CheckoutStepType.REVIEW_ORDER],
        nameMultiLine: false,
      },
    ],
  },
};
