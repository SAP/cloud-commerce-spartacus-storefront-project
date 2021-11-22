import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import {
  Cart,
  CartModification,
  PromotionResult,
  SaveCartResult,
  Voucher,
} from '../models/cart.model';

export const CART_NORMALIZER = new InjectionToken<Converter<any, Cart>>(
  'CartNormalizer'
);

export const ORDRE_ENTRY_PROMOTIONS_NORMALIZER = new InjectionToken<
  Converter<any, PromotionResult[]>
>('OrderEntryPromotionsNormalizer');

export const CART_MODIFICATION_NORMALIZER = new InjectionToken<
  Converter<any, CartModification>
>('CartModificationNormalizer');

export const SAVE_CART_NORMALIZER = new InjectionToken<
  Converter<any, SaveCartResult>
>('SaveCartNormalizer');

export const CART_VOUCHER_NORMALIZER = new InjectionToken<
  Converter<any, Voucher>
>('CartVoucherNormalizer');
