/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FactoryProvider, inject } from '@angular/core';
import {
  provideConfigFactory,
  provideDefaultConfigFactory,
} from '../../config';
import '../config/features-config';
import { DefaultFeatureFlags, RootFeatureFlags } from './feature-flags-tokens';

export const provideFeatureFlagsToFeatureConfig: FactoryProvider[] = [
  // Copies RootFeatureFlags to RootConfig
  provideConfigFactory(() => {
    const flags = inject(RootFeatureFlags);
    return { features: { ...flags } };
  }),

  // Copies DefaultFeatureFlags to DefaultFeaturesConfig
  provideDefaultConfigFactory(() => {
    const flags = inject(DefaultFeatureFlags);
    return { features: { ...flags } };
  }),
];
