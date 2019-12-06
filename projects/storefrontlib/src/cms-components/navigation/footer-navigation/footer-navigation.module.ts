import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';

import { GenericLinkModule } from '../../../shared/components/generic-link/generic-link.module';
import { NavigationModule } from '../navigation/navigation.module';
import { FooterNavigationComponent } from './footer-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavigationModule,
    GenericLinkModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        FooterNavigationComponent: {
          component: FooterNavigationComponent,
        },
      },
    }),
  ],
  declarations: [FooterNavigationComponent],
  entryComponents: [FooterNavigationComponent],
  exports: [FooterNavigationComponent],
})
export class FooterNavigationModule {}
