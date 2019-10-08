import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { ngExpressEngine } from '@nguniversal/express-engine';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
export { AppServerModule } from './app/app.server.module';
export {
  fetchOccBaseSitesConfigSSR,
  getOccBaseUrlFromMetaTagSSR,
  OccBaseSitesConfig,
} from './app/base-site/index';
