/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as checkoutMultiDVariants from '../../../helpers/checkout-multi-dimensional';
import { viewportContext } from '../../../helpers/viewport-context';

context('Multi Dimensional - checkout flow', () => {
  viewportContext(['desktop', 'mobile'], () => {
    describe('multi-d core-tests', () => {
      checkoutMultiDVariants.testCheckoutRegisteredUser();
    });
  });
});
