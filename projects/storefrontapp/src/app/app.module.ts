import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StorefrontComponent, StorefrontModule } from 'storefrontlib';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    StorefrontModule.withConfig({
      server: {
        baseUrl: environment.occBaseUrl
      }
    })
  ],
  bootstrap: [StorefrontComponent]
})
export class AppModule {}
