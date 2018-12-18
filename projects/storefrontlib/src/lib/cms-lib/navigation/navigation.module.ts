import { BootstrapModule } from '../../bootstrap.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './navigation.component';
import { NavigationUIComponent } from './navigation-ui.component';
import { NavigationService } from './navigation.service';
import { ConfigModule } from '@spartacus/core';
import { CmsConfig } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BootstrapModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        NavigationComponent: { selector: 'cx-navigation' }
      }
    })
  ],
  providers: [NavigationService],
  declarations: [NavigationComponent, NavigationUIComponent],
  entryComponents: [NavigationComponent],
  exports: [NavigationComponent, NavigationUIComponent]
})
export class NavigationModule {}
