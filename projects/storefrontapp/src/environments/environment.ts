// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
import { Environment } from './models/environment.model';

export const environment: Environment = {
  production: false,
  occBaseUrl: buildProcess.env.CX_BASE_URL ?? 'https://localhost:9002',
  //'https://api.cpce-teamtiger1-d1-public.model-t.cc.commerce.ondemand.com',
  occApiPrefix: '/occ/v2/',
  cds: buildProcess.env.CX_CDS ?? false,
  b2b: buildProcess.env.CX_B2B ?? true,
  cdc: buildProcess.env.CX_CDC ?? false,
};
