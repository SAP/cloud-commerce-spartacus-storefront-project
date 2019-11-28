import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { I18nModule } from '@spartacus/core';

import {
  MediaModule,
  OnlyNumberDirectiveModule,
  ItemCounterModule,
} from '../../../../../shared/index';

import { CancellationReturnItemsComponent } from './cancellation-return-items.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    MediaModule,
    OnlyNumberDirectiveModule,
    ItemCounterModule,
  ],
  declarations: [CancellationReturnItemsComponent],
  exports: [CancellationReturnItemsComponent],
  entryComponents: [CancellationReturnItemsComponent],
})
export class CancellationReturnItemsModule {}
