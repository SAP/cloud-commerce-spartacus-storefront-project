import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { defaultOccServiceOrderConfig } from './config/default-occ-s4-service-config';
import { CancelServiceOrderAdapter } from '../core/connector';
import { OccCancelServiceOrderAdapter } from './adapters';

@NgModule({
  providers: [
    provideDefaultConfig(defaultOccServiceOrderConfig),
    {
      provide: CancelServiceOrderAdapter,
      useClass: OccCancelServiceOrderAdapter,
    },
  ],
})
export class S4ServiceOrderOccModule {}
