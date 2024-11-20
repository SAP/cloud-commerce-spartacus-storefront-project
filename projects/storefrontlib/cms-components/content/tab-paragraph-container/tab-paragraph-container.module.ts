/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { OutletModule } from '../../../cms-structure/outlet/outlet.module';
import { PageComponentModule } from '../../../cms-structure/page/component/page-component.module';
import { TabModule } from '../tab/tab.module';
import { TabParagraphContainerComponent } from './tab-paragraph-container.component';

@NgModule({
  imports: [
    CommonModule,
    PageComponentModule,
    OutletModule,
    I18nModule,
    TabModule,
    FeaturesConfigModule,
    TabParagraphContainerComponent,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CMSTabParagraphContainer: {
          component: TabParagraphContainerComponent,
        },
      },
    }),
  ],
  exports: [TabParagraphContainerComponent],
})
export class TabParagraphContainerModule {}
