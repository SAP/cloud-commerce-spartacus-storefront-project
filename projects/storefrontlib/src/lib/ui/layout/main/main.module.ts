import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderModule } from './../header/header.module';
import { UiFrameworkModule } from '../../ui-framework/ui-framework.module';
import { CmsModule } from '../../../cms/cms.module';
import { GlobalMessageComponentModule } from '../../../global-message/global-message.module';
import { PwaModule } from './../../../pwa/pwa.module';
import { OutletRefModule } from '../../../outlet/outlet-ref/outlet-ref.module';
import { LoginModule } from '../../../user/login/login.module';

import { StorefrontComponent } from './storefront.component';
import { PageLayoutModule } from '../../../cms/page-layout/page-layout.module';
import { SeoModule } from '../../../../cms-structure/index';
import { PageSlotModule } from '../../../../cms-structure/page/slot/page-slot.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GlobalMessageComponentModule,
    CmsModule,
    LoginModule,
    HeaderModule,
    UiFrameworkModule,
    OutletRefModule,
    PwaModule,
    PageLayoutModule,
    SeoModule,
    PageSlotModule
  ],
  declarations: [StorefrontComponent],
  exports: [StorefrontComponent]
})
export class MainModule {}
