/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@commerce-storefront-toolset/core';
import { en } from './en/index';

export const bulkPricingTranslations: TranslationResources = {
  en,
};

// expose all translation chunk mapping for bulkPricing feature
export const bulkPricingTranslationChunksConfig: TranslationChunksConfig = {
  bulkPricing: ['bulkPricingTable'],
};
