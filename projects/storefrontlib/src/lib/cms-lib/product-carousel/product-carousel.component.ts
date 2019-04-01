import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
} from '@angular/core';

import { WindowRef } from '@spartacus/core';
import { ProductCarouselService } from './product-carousel.component.service';

@Component({
  selector: 'cx-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCarouselComponent implements OnInit {
  private window: Window;

  constructor(
    winRef: WindowRef,
    private el: ElementRef,
    public service: ProductCarouselService
  ) {
    this.window = winRef.nativeWindow;
  }

  ngOnInit() {
    this.service.setTitle();
    this.service.setItemSize(this.window, this.el.nativeElement);
    this.service.setItems();
    this.service.setItemAsActive(0);
  }
}
