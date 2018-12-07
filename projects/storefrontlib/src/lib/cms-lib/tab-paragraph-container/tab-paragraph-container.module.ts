import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabParagraphContainerComponent } from './tab-paragraph-container.component';
import { ConfigModule } from '@spartacus/core';
import { CmsModuleConfig } from '../../cms/cms-module-config';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsModuleConfig>{
      cmsComponents: {
        CMSTabParagraphComponent: { selector: 'cx-tab-paragraph-container' }
      }
    })
  ],
  declarations: [TabParagraphContainerComponent],
  entryComponents: [TabParagraphContainerComponent],
  exports: [TabParagraphContainerComponent]
})
export class TabParagraphContainerModule {}
