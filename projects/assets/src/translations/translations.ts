/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './en/index';
import { ja } from './ja/index';
import { de } from './de/index';
import { zh } from './zh/index';

interface TranslationResources {
  [lang: string]: {
    [chunkName: string]: {
      [key: string]: any;
    };
  };
}

export const translations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};
