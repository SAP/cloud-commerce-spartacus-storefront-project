/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  retries: {
    runMode: 2,
  },
  videoUploadOnPasses: false,
  env: {
    CLIENT_ID: 'mobile_android',
    CLIENT_SECRET: 'secret',
    API_URL: 'https://40.76.109.9:9002',
    BASE_SITE: 'electronics-spa',
    BASE_LANG: 'en',
    BASE_CURRENCY: 'USD',
    OCC_PREFIX: '/occ/v2',
    OCC_PREFIX_USER_ENDPOINT: 'users',
    OCC_PREFIX_ORDER_ENDPOINT: 'orders',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const latestStableChromeBrowsers = config.browsers
        .filter(
          (browser) =>
            browser.channel === 'stable' && browser.family === 'chromium'
        )
        .sort(
          (browserA, browserB) =>
            Number(browserA.version) - Number(browserB.version)
        )[0];

      config.browsers = [latestStableChromeBrowsers];

      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:4200',
  },
});
