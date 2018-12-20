import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducerToken, reducerProvider } from './store/reducers/index';
import { effects } from './store/effects/index';
import { metaReducers } from './store/reducers/index';

import { services } from './facade/index';

import { MultiStepCheckoutModule } from './components/multi-step-checkout/multi-step-checkout.module';
import { CartComponentModule } from './../cart/cart.module';

import { guards } from './guards/index';
@NgModule({
  imports: [
    CommonModule,
    CartComponentModule,
    MultiStepCheckoutModule,
    StoreModule.forFeature('checkout', reducerToken, { metaReducers }),
    EffectsModule.forFeature(effects)
  ],
  providers: [reducerProvider, ...services, ...guards]
})
export class CheckoutModule {}
