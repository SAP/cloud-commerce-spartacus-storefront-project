import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { FutureStockAccordionModule } from '../future-stock-accordion/future-stock-accordion.module';

import { FutureStockTriggerComponent } from './future-stock-trigger.component';

@NgModule({
  imports: [CommonModule, I18nModule, FutureStockAccordionModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        FutureStockComponent: {
          component: FutureStockTriggerComponent,
        },
      },
    }),
  ],
  declarations: [FutureStockTriggerComponent],
  exports: [FutureStockTriggerComponent],
})
export class FutureStockTriggerModule {}
