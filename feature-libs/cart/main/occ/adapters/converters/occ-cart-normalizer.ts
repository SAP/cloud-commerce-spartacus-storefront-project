import { Injectable } from '@angular/core';
import { Cart } from '@spartacus/cart/main/root';
import {
  Converter,
  ConverterService,
  Occ,
  PRODUCT_NORMALIZER,
} from '@spartacus/core';
import { ORDRE_ENTRY_PROMOTIONS_NORMALIZER } from 'feature-libs/cart/main/root';

@Injectable({ providedIn: 'root' })
export class OccCartNormalizer implements Converter<Occ.Cart, Cart> {
  constructor(private converter: ConverterService) {}

  convert(source: Occ.Cart, target?: Cart): Cart {
    if (target === undefined) {
      target = { ...(source as any) } as Cart;
    }

    this.removeDuplicatePromotions(source, target);

    if (source.entries) {
      target.entries = source.entries.map((entry) => ({
        ...entry,
        product: this.converter.convert(entry.product, PRODUCT_NORMALIZER),
        promotions: this.converter.convert(
          { item: entry, promotions: target?.appliedProductPromotions },
          ORDRE_ENTRY_PROMOTIONS_NORMALIZER
        ),
      }));
    }

    return target;
  }

  /**
   * Remove all duplicate promotions
   */
  private removeDuplicatePromotions(source: any, target: Cart): void {
    if (source && source.potentialOrderPromotions) {
      target.potentialOrderPromotions = this.removeDuplicateItems(
        source.potentialOrderPromotions
      );
    }

    if (source && source.potentialProductPromotions) {
      target.potentialProductPromotions = this.removeDuplicateItems(
        source.potentialProductPromotions
      );
    }

    if (source && source.appliedOrderPromotions) {
      target.appliedOrderPromotions = this.removeDuplicateItems(
        source.appliedOrderPromotions
      );
    }

    if (source && source.appliedProductPromotions) {
      target.appliedProductPromotions = this.removeDuplicateItems(
        source.appliedProductPromotions
      );
    }
  }

  private removeDuplicateItems(itemList: any[]): any[] {
    return itemList.filter((p, i, a) => {
      const b = a.map((el) => JSON.stringify(el));
      return i === b.indexOf(JSON.stringify(p));
    });
  }
}
