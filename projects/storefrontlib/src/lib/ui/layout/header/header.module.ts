import { RouterModule } from '@angular/router';
import { CmsModule } from './../../../cms/cms.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiteContextModule } from './../../../site-context/site-context.module';
import { HeaderComponent } from './header.component';
import { HeaderSkipperComponent } from './header-skipper/header-skipper.component';
import { LoginModule } from '../../../user/components/login/login.module';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { PwaModule } from '../../../pwa/pwa.module';
import { UrlTranslationModule } from '@spartacus/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HardcodedSiteContext } from './sitecontext-slot.interceptor';

@NgModule({
  imports: [
    CommonModule,
    SiteContextModule,
    CmsModule,
    LoginModule,
    RouterModule,
    PwaModule,
    UrlTranslationModule
  ],
  declarations: [HeaderComponent, HeaderSkipperComponent, MobileMenuComponent],
  exports: [HeaderComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HardcodedSiteContext,
      multi: true
    }
  ]
})
export class HeaderModule {}
