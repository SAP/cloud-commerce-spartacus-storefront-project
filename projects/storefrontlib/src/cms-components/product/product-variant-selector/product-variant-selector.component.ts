import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product, BaseOption, VariantType } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CurrentProductService } from '../current-product.service';
import { tap, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'cx-product-variant-selector',
  templateUrl: './product-variant-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantSelectorComponent implements OnInit {
  constructor(private currentProductService: CurrentProductService) {}

  variants: BaseOption[] = [];
  variantType = VariantType;
  product$: Observable<Product>;

  ngOnInit(): void {
    this.product$ = this.currentProductService.getProduct().pipe(
      filter(product => !!(product && product.baseOptions)),
      distinctUntilChanged(),
      tap(product => {
        product.baseOptions.forEach(option => {
          if (option && option.variantType) {
            this.variants[option.variantType] = option;
          }
        });
      })
    );
  }
}
