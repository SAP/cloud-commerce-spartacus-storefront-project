import { InjectionToken } from '@angular/core';
import { Converter } from '../../../util/converter.service';
import { UIProduct } from '../../model/product';

export const PRODUCT_NORMALIZER = new InjectionToken<Converter<any, UIProduct>>(
  'ProductNormalizer'
);
