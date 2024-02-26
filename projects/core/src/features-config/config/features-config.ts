/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '../../config/config-tokens';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class FeaturesConfig {
  features?: FeaturesConfigContent;
}

export interface FeaturesConfigContent {
  level?: string;
  [featureToggle: string]: string | boolean | undefined;
}

declare module '../../config/config-tokens' {
  interface Config extends FeaturesConfig {}
}
