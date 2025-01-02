/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    cdsTranslationChunksConfig as originalCdsTranslationChunksConfig,
    cdsTranslations as originalCdsTranslations,
} from '@spartacus/cds/assets';
import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';

/** @deprecated  Use @spartacus/cds/assets instead */
export const cdsTranslations: TranslationResources = originalCdsTranslations;

/** @deprecated  Use @spartacus/cds/assets instead */
export const cdsTranslationChunksConfig: TranslationChunksConfig =
  originalCdsTranslationChunksConfig;
