// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

import { Environment } from './models/environment.model';

export const environment: Environment = {
  production: false,
  occBaseUrl:
    build.process.env.SPARTACUS_BASE_URL ??
    'https://api.cpce-teamtiger1-d1-public.model-t.cc.commerce.ondemand.com/',
  // 'https://spartacus-dev3.eastus.cloudapp.azure.com:9002',
  occApiPrefix: build.process.env.SPARTACUS_API_PREFIX ?? '/occ/v2/',
  productconfig: true,
  cds: build.process.env.SPARTACUS_CDS ?? false,
  b2b: build.process.env.SPARTACUS_B2B ?? true,
  cdc: build.process.env.SPARTACUS_CDC ?? false,
};
