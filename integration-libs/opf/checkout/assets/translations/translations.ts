/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './en/index';
import { extractTranslationChunksConfig } from '@spartacus/core';

export const opfCheckoutTranslationChunksConfig =
  extractTranslationChunksConfig(en);

export { en as opfCheckoutTranslationsEn } from './en/index';
