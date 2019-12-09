import { InjectionToken } from '@angular/core';
import { Configurator } from '../../../model/configurator.model';
import { Converter } from '../../../util/converter.service';

export const CONFIGURATION_NORMALIZER = new InjectionToken<
  Converter<any, Configurator.Configuration>
>('ConfigurationNormalizer');

export const CONFIGURATION_SERIALIZER = new InjectionToken<
  Converter<Configurator.Configuration, any>
>('ConfigurationSerializer');

export const CONFIGURATION_PRICE_SUMMARY_NORMALIZER = new InjectionToken<
  Converter<any, Configurator.Configuration>
>('ConfigurationPriceSummaryNormalizer');

export const CONFIGURATION_ADD_TO_CART_SERIALIZER = new InjectionToken<
  Converter<Configurator.AddToCartParameters, any>
>('ConfigurationAddToCartSerializer');

export const CONFIGURATION_OVERVIEW_NORMALIZER = new InjectionToken<
  Converter<any, Configurator.Overview>
>('ConfigurationOverviewNormalizer');
