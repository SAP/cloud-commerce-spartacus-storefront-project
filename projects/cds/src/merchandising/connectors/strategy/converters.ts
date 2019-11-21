import { InjectionToken } from '@angular/core';
import { Breadcrumb, Converter, Product } from '@spartacus/core';
import { MerchandisingProducts } from '../../model/merchandising.products.model';
import { MerchandisingFacet } from './../../model/merchandising-facet';
import {
  MerchandisingProduct,
  StrategyResult,
} from './../../model/strategy.result';

export const MERCHANDISING_PRODUCTS_NORMALIZER = new InjectionToken<
  Converter<StrategyResult, MerchandisingProducts>
>('MerchandisingProductsNormalizer');

export const MERCHANDISING_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<MerchandisingProduct, Product>
>('MerchandisingProductNormalizer');

export const MERCHANDISING_FACET_NORMALIZER = new InjectionToken<
  Converter<Breadcrumb[], MerchandisingFacet[]>
>('MerchandisingFacetNormalizer');

export const MERCHANDISING_FACET_TO_QUERYPARAM_NORMALIZER = new InjectionToken<
  Converter<MerchandisingFacet[], string>
>('MerchandisingFacetToQueryparamNormalizer');
