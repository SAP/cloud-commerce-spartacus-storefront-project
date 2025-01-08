/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';
import { ja } from './ja/index';
import { de } from './de/index';
import { zh } from './zh/index';

export const productVariantsTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

// expose all translation chunk mapping for variants sub features
export const productVariantsTranslationChunksConfig: TranslationChunksConfig = {
  productVariants: ['productVariants'],
};
