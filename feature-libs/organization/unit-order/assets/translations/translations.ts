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
 *             -   resources: unitOrderTranslations
 *             +   resources: { en: unitOrderTranslationsEn }
 *               }
 *             ```
 */
export const unitOrderTranslations = {
  en,
};

export { cs as unitOrderTranslationsCs } from './cs/index';
export { de as unitOrderTranslationsDe } from './de/index';
export { en as unitOrderTranslationsEn } from './en/index';
export { es as unitOrderTranslationsEs } from './es/index';
export { es_CO as unitOrderTranslationsEs_CO } from './es_CO/index';
export { fr as unitOrderTranslationsFr } from './fr/index';
export { hi as unitOrderTranslationsHi } from './hi/index';
export { hu as unitOrderTranslationsHu } from './hu/index';
export { id as unitOrderTranslationsId } from './id/index';
export { it as unitOrderTranslationsIt } from './it/index';
export { ja as unitOrderTranslationsJa } from './ja/index';
export { ko as unitOrderTranslationsKo } from './ko/index';
export { pl as unitOrderTranslationsPl } from './pl/index';
export { pt as unitOrderTranslationsPt } from './pt/index';
export { ru as unitOrderTranslationsRu } from './ru/index';
export { zh as unitOrderTranslationsZh } from './zh/index';
export { zh_TW as unitOrderTranslationsZh_TW } from './zh_TW/index';
