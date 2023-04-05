/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as checkoutVariants from '../../../helpers/checkout-variants';

import {
  APPAREL_BASESITE,
  configureProductWithVariants,
} from '../../../helpers/variants/apparel-checkout-flow';

import { viewportContext } from '../../../helpers/viewport-context';

context('Apparel - checkout as guest', () => {
  viewportContext(['desktop'], () => {
    before(() => {
      checkoutVariants.generateVariantGuestUser();
    });

    beforeEach(() => {
      Cypress.env('BASE_SITE', APPAREL_BASESITE);
      configureProductWithVariants();
    });

    checkoutVariants.testCheckoutVariantAsGuest();
  });
});
