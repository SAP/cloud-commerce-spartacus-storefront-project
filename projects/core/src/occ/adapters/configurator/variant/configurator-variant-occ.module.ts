import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '../../../../config/config.module';
import { ConfiguratorCommonsAdapter } from '../../../../configurator/commons/connectors/configurator-commons.adapter';
import {
  CONFIGURATION_NORMALIZER,
  CONFIGURATION_SERIALIZER,
} from '../../../../configurator/commons/connectors/converters';
import { OccConfiguratorVariantNormalizer } from './converters/occ-configurator-variant-normalizer';
import { OccConfiguratorVariantSerializer } from './converters/occ-configurator-variant-serializer';
import { defaultOccVariantConfiguratorConfigFactory } from './default-occ-configurator-variant-config';
import { OccConfiguratorVariantAdapter } from './occ-configurator-variant.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfigFactory(defaultOccVariantConfiguratorConfigFactory),
  ],
  providers: [
    {
      provide: ConfiguratorCommonsAdapter,
      useClass: OccConfiguratorVariantAdapter,
    },
    {
      provide: CONFIGURATION_NORMALIZER,
      useClass: OccConfiguratorVariantNormalizer,
      multi: true,
    },
    {
      provide: CONFIGURATION_SERIALIZER,
      useClass: OccConfiguratorVariantSerializer,
      multi: true,
    },
  ],
})
export class ConfiguratorVariantOccModule {}
