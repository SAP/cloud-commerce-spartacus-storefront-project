import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { StoreFinderModule } from '@spartacus/storefinder';
import { IconModule, SpinnerModule } from '@spartacus/storefront';
import { StoreListComponent } from './store-list.component';
import { StoreComponent, StoreScheduleComponent } from './store/index';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StoreFinderModule,
    IconModule,
    SpinnerModule,
  ],
  exports: [StoreListComponent, StoreComponent, StoreScheduleComponent],
  declarations: [StoreListComponent, StoreComponent, StoreScheduleComponent],
})
export class StoreListModule {}
