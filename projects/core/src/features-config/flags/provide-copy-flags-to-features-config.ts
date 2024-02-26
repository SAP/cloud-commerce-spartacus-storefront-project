/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FactoryProvider, inject } from '@angular/core';
import { provideDefaultConfigFactory } from '../../config';
import { FeatureFlags } from './flags-tokens';

/**
 * Copies Flags to FeaturesConfig
 */
export const provideCopyFlagsToFeaturesConfig: () => FactoryProvider = () =>
  provideDefaultConfigFactory(() => {
    const flags = inject(FeatureFlags);
    return {
      features: {
        ...flags,
      },
    };
  });
