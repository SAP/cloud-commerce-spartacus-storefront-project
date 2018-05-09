import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';

import { ConfigService } from './config.service';

import { OccModule } from './occ/occ.module';
import { UiModule } from './ui/ui.module';
import { CmsLibModule } from './cms-lib/cms-lib.module';
import { UiFrameworkModule } from './ui/ui-framework/ui-framework.module';

import { CmsModule } from './cms/cms.module';
import { RoutingModule } from './routing/routing.module';
import { SiteContextModule } from './site-context/site-context.module';
import { ProductModule } from './product/product.module';

import { appRoutes } from './app.routes';

// bootstrap
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';

@NgModule({
  imports: [
    BrowserModule,
    OccModule.forRoot(ConfigService),
    CmsLibModule,
    UiModule,
    UiFrameworkModule,

    CmsModule.forRoot(ConfigService),
    SiteContextModule.forRoot(ConfigService),
    CheckoutModule,
    RoutingModule.forRoot(ConfigService),
    RouterModule.forRoot(appRoutes),
    ProductModule,
    UserModule,
    CartModule
  ],

  providers: [
    ConfigService,
    {
      // TODO: configure locale
      provide: LOCALE_ID,
      useValue: 'nl-NL'
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
