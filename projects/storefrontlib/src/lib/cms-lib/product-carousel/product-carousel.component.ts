import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { ProductService, Product } from '@spartacus/core';

import { Subscription, fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AbstractCmsComponent } from '../../cms/components/abstract-cms-component';
import { CmsService } from '../../cms/facade/cms.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cx-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent extends AbstractCmsComponent
  implements OnDestroy, OnInit {
  productGroups: Array<string[]>;
  products: { [key: string]: Observable<Product> } = {};

  resize$: Subscription;

  @ViewChild('carousel')
  carousel: NgbCarousel;

  @Input()
  productCodes: Array<string>;

  constructor(
    protected cmsService: CmsService,
    protected cd: ChangeDetectorRef,
    private productService: ProductService
  ) {
    super(cmsService, cd);
  }

  ngOnInit() {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.createGroups());
  }

  prev(): void {
    this.carousel.prev();
  }

  next(): void {
    this.carousel.next();
  }

  protected fetchData(): void {
    this.setProductCodes();
    this.productCodes.forEach(code => {
      this.products[code] = this.productService.get(code);
      this.productService.isProductLoaded(code).subscribe();
    });
    this.createGroups();
    super.fetchData();
  }

  protected createGroups(): void {
    const groups: Array<string[]> = [];
    this.productCodes.forEach(product => {
      const lastGroup: string[] = groups[groups.length - 1];
      if (lastGroup && lastGroup.length < this.getItemsPerPage()) {
        lastGroup.push(product);
      } else {
        groups.push([product]);
      }
    });
    this.productGroups = groups;
  }

  protected getItemsPerPage(): number {
    const smallScreenMaxWidth = 576;
    const tabletScreenMaxWidth = 768;
    const { innerWidth } = window;
    let itemsPerPage: number;
    if (innerWidth < smallScreenMaxWidth) {
      itemsPerPage = 1;
    } else if (
      innerWidth > smallScreenMaxWidth &&
      innerWidth < tabletScreenMaxWidth
    ) {
      itemsPerPage = 2;
    } else {
      itemsPerPage = 4;
    }
    return itemsPerPage;
  }

  protected setProductCodes(): void {
    if (this.component && this.component.productCodes) {
      this.productCodes = this.component.productCodes.split(' ');
    }
  }

  ngOnDestroy() {
    if (this.resize$) {
      this.resize$.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
