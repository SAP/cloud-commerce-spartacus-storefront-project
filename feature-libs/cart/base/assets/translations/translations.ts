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
 *             -   resources: cartBaseTranslations
 *             +   resources: { en: cartBaseTranslationsEn }
 *               }
 *             ```
 */
export const cartBaseTranslations = {
  en,
};

export { cs as cartBaseTranslationsCs } from './cs/index';
export { de as cartBaseTranslationsDe } from './de/index';
export { en as cartBaseTranslationsEn } from './en/index';
export { es as cartBaseTranslationsEs } from './es/index';
export { es_CO as cartBaseTranslationsEs_CO } from './es_CO/index';
export { fr as cartBaseTranslationsFr } from './fr/index';
export { hi as cartBaseTranslationsHi } from './hi/index';
export { hu as cartBaseTranslationsHu } from './hu/index';
export { id as cartBaseTranslationsId } from './id/index';
export { it as cartBaseTranslationsIt } from './it/index';
export { ja as cartBaseTranslationsJa } from './ja/index';
export { ko as cartBaseTranslationsKo } from './ko/index';
export { pl as cartBaseTranslationsPl } from './pl/index';
export { pt as cartBaseTranslationsPt } from './pt/index';
export { ru as cartBaseTranslationsRu } from './ru/index';
export { zh as cartBaseTranslationsZh } from './zh/index';
export { zh_TW as cartBaseTranslationsZh_TW } from './zh_TW/index';
