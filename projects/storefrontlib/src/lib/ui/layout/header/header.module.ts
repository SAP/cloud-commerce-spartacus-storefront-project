import { RouterModule } from '@angular/router';
import { CmsModule } from './../../../cms/cms.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { HeaderSkipperComponent } from './header-skipper/header-skipper.component';
import { LoginModule } from '../../../user/login/login.module';

import { PwaModule } from '../../../pwa/pwa.module';
import { UrlTranslationModule } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    CmsModule,
    LoginModule,
    RouterModule,
    PwaModule,
    UrlTranslationModule
  ],
  declarations: [HeaderComponent, HeaderSkipperComponent],
  exports: [HeaderComponent],
  providers: []
})
export class HeaderModule {}
