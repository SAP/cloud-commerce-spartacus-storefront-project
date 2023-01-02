/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PRODUCT_CONFIGURATOR_RULEBASED_FEATURE,
  PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_OBSOLETE,
  TODO_SPARTACUS,
} from '../../../../shared/constants';
import { ConfigDeprecation } from '../../../../shared/utils/file-utils';

export const PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_MIGRATION: ConfigDeprecation =
  {
    propertyName: PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_OBSOLETE,
    comment: `// ${TODO_SPARTACUS} '${PRODUCT_CONFIGURATOR_RULEBASED_FEATURE_OBSOLETE}' has been has been replaced with '${PRODUCT_CONFIGURATOR_RULEBASED_FEATURE}' .\n`,
  };
