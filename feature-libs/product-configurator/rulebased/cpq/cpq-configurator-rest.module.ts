import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RulebasedConfiguratorConnector } from '../core/connectors/rulebased-configurator.connector';
import { CpqConfiguratorNormalizer } from './cpq-configurator-normalizer';
import { CpqConfiguratorOverviewNormalizer } from './cpq-configurator-overview-normalizer';
import { CpqConfiguratorRestAdapter } from './cpq-configurator-rest.adapter';
import { CpqConfiguratorSerializer } from './cpq-configurator-serializer';
import { CpqConfiguratorValueSerializer } from './cpq-configurator-value-serializer';
import {
  CPQ_CONFIGURATOR_NORMALIZER,
  CPQ_CONFIGURATOR_OVERVIEW_NORMALIZER,
  CPQ_CONFIGURATOR_QUANTITY_SERIALIZER,
  CPQ_CONFIGURATOR_SERIALIZER,
} from './cpq-configurator.converters';

@NgModule({
  imports: [CommonModule],

  providers: [
    {
      provide: RulebasedConfiguratorConnector.CONFIGURATOR_ADAPTER_LIST,
      useClass: CpqConfiguratorRestAdapter,
      multi: true,
    },
    {
      provide: CPQ_CONFIGURATOR_NORMALIZER,
      useClass: CpqConfiguratorNormalizer,
      multi: true,
    },
    {
      provide: CPQ_CONFIGURATOR_SERIALIZER,
      useClass: CpqConfiguratorSerializer,
      multi: true,
    },
    {
      provide: CPQ_CONFIGURATOR_QUANTITY_SERIALIZER,
      useClass: CpqConfiguratorValueSerializer,
      multi: true,
    },
    {
      provide: CPQ_CONFIGURATOR_OVERVIEW_NORMALIZER,
      useClass: CpqConfiguratorOverviewNormalizer,
      multi: true,
    },
  ],
})
export class CpqConfiguratorRestModule {}
