import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { fetchOccBaseSites, OccBaseSites } from '@spartacus/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchOccBaseSites().then(baseSites => {
    console.log(baseSites); //spike todo remove
    platformBrowserDynamic([
      { provide: OccBaseSites, useValue: baseSites },
    ]).bootstrapModule(AppModule);
  });
});
