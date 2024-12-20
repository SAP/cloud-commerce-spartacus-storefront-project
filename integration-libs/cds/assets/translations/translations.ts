/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './en/index';

/**
 * @deprecated use **specific language** translations (suffixed with language code) instead,
 * like in the following example:
 *             ```diff
 *               i18n: {
 *             -   resources: cdsTranslations
 *             +   resources: { en: cdsTranslationsEn }
 *               }
 *             ```
 */
export const cdsTranslations = {
  en,
};

export { cs as cdsTranslationsCs } from './cs/index';
export { de as cdsTranslationsDe } from './de/index';
export { en as cdsTranslationsEn } from './en/index';
export { es as cdsTranslationsEs } from './es/index';
export { es_CO as cdsTranslationsEs_CO } from './es_CO/index';
export { fr as cdsTranslationsFr } from './fr/index';
export { hi as cdsTranslationsHi } from './hi/index';
export { hu as cdsTranslationsHu } from './hu/index';
export { id as cdsTranslationsId } from './id/index';
export { it as cdsTranslationsIt } from './it/index';
export { ja as cdsTranslationsJa } from './ja/index';
export { ko as cdsTranslationsKo } from './ko/index';
export { pl as cdsTranslationsPl } from './pl/index';
export { pt as cdsTranslationsPt } from './pt/index';
export { ru as cdsTranslationsRu } from './ru/index';
export { zh as cdsTranslationsZh } from './zh/index';
export { zh_TW as cdsTranslationsZh_TW } from './zh_TW/index';
