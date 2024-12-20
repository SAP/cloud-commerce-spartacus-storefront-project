/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './en/index';
import { extractTranslationChunksConfig } from '@spartacus/core';

/**
 * @deprecated use **specific language** translations (suffixed with language code) instead,
 * like in the following example:
 *             ```diff
 *               i18n: {
 *             -   resources: opfPaymentTranslations
 *             +   resources: { en: opfPaymentTranslationsEn }
 *               }
 *             ```
 */
export const opfPaymentTranslations = {
  en,
};

export const opfPaymentTranslationChunksConfig = extractTranslationChunksConfig(en);

export { en as opfPaymentTranslationsEn } from './en/index';
