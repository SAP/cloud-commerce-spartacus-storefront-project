/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Config, Image, VariantOptionQualifier } from '@spartacus/core';
import { ProductMultiDimensionalConfig } from '@spartacus/product-multi-dimensional/selector/root';

@Injectable({ providedIn: 'root' })
export class ProductMultiDimensionalSelectorImagesService {
  protected config: Config = inject(Config);

  /**
   * Retrieves the images for variant option qualifiers that match the specified format.
   */
  getVariantOptionImages(
    variantOptionQualifiers: VariantOptionQualifier[],
    variantOptionValue: string
  ): Image[] {
    const format = (this.config as ProductMultiDimensionalConfig)
      .multiDimensional?.imageFormat;
    return variantOptionQualifiers
      .filter((optionQualifier) => optionQualifier.image?.format === format)
      .map((optionQualifier) => {
        const altText = optionQualifier.image?.altText ?? variantOptionValue;
        return {
          altText,
          format: optionQualifier.image?.format,
          url: this.getBaseUrl() + optionQualifier.image?.url,
        };
      });
  }

  protected getBaseUrl(): string {
    return (
      this.config.backend?.media?.baseUrl ??
      this.config.backend?.occ?.baseUrl ??
      ''
    );
  }
}
