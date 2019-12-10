import { Component, Input, OnInit } from '@angular/core';

import {
  OccConfig,
  VariantOption,
  VariantOptionQualifier,
  VariantQualifier,
} from '@spartacus/core';

@Component({
  selector: 'cx-style-icons',
  templateUrl: './style-icons.component.html',
  styleUrls: ['./style-icons.component.scss'],
})
export class VariantStyleIconsComponent implements OnInit {
  constructor(private config: OccConfig) {}

  @Input()
  variants: VariantOption[];

  variantNames: { [key: string]: string } = {};

  ngOnInit() {
    this.variants.forEach(variant => {
      this.variantNames[variant.code] = this.getVariantName(
        variant.variantOptionQualifiers
      );
    });
  }

  getVariantThumbnailUrl(
    variantOptionQualifiers: VariantOptionQualifier[]
  ): string {
    const thumbnail = variantOptionQualifiers.find(
      item => item.qualifier === VariantQualifier.THUMBNAIL
    );
    return thumbnail
      ? `${this.config.backend.occ.baseUrl}${thumbnail.image.url}`
      : '';
  }

  private getVariantName(
    variantOptionQualifiers: VariantOptionQualifier[]
  ): string {
    const rollupProperty = variantOptionQualifiers.find(
      item => item.qualifier === VariantQualifier.ROLLUP_PROPERTY
    );
    const property = rollupProperty
      ? variantOptionQualifiers.find(
          item => item.qualifier === rollupProperty.value
        )
      : null;
    return property ? property.value : '';
  }
}
