/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';
import '@spartacus/product-configurator/common';
/**
 * @deprecated since 2211.25. Not needed for commerce based CPQ orchestration (which is the default communication flavour).
 * Refer to configuration setting ConfiguratorCoreConfig.productConfigurator.cpqOverOcc = true.
 * The other flavour (performing direct calls from composable storefront to CPQ) is technically no longer supported.
 */
export interface ProductConfiguratorCpqAuthConfig {
  cpq?: {
    authentication: {
      /** We should stop using/sending a token shortly before expiration,
       * to avoid that it is actually expired when evaluated in the target system.
       * Time given in ms. */
      tokenExpirationBuffer: number;
      /** max time in ms to pass until a token is considered expired and re-fetched,
       * even if token expiration time is longer */
      tokenMaxValidity: number;
      /** min time to pass until a token is re-fetched, even if token expiration time is shorter */
      tokenMinValidity: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class CpqConfiguratorAuthConfig {
  productConfigurator: ProductConfiguratorCpqAuthConfig;
}

declare module '@spartacus/product-configurator/common' {
  interface ProductConfiguratorConfig
    extends ProductConfiguratorCpqAuthConfig {}
}
