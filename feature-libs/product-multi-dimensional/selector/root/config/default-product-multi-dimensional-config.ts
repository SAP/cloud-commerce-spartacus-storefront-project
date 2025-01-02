/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VariantQualifier } from '@spartacus/core';
import { ProductMultiDimensionalConfig } from './product-multi-dimensional-config';

export const defaultProductMultiDimensionalConfig: ProductMultiDimensionalConfig =
  {
    multiDimensional: {
      imageFormat: VariantQualifier.STYLE_SWATCH,
    },
  };
