import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { defaultOccServiceOrderConfig } from './config/default-occ-s4-service-config';
import { RescheduleServiceOrderAdapter } from '../core/connector';
import { OccRescheduleServiceOrderAdapter } from './adapters';

@NgModule({
  providers: [
    provideDefaultConfig(defaultOccServiceOrderConfig),
    {
      provide: RescheduleServiceOrderAdapter,
      useClass: OccRescheduleServiceOrderAdapter,
    },
  ],
})
export class S4ServiceOrderOccModule {}
