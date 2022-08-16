import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects } from './effects/index';
import { reducerProvider, reducerToken } from './reducers/index';
import { UNIT_ORDER_FEATURE } from './unit-order-state';

@NgModule({
  imports: [
    StoreModule.forFeature(UNIT_ORDER_FEATURE, reducerToken),
    EffectsModule.forFeature(effects),
  ],
  providers: [reducerProvider],
})
export class UnitOrderStoreModule {}
