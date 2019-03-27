import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { YotpoService } from './../service/yotpo.service';
import { Observable } from 'rxjs';
import { Product } from '@spartacus/core';

@Component({
  selector: 'cx-yotpo-review',
  templateUrl: './yotpo-review.component.html',
  styleUrls: []
})
export class YotporeviewComponent implements OnInit, AfterViewInit {
  product$: Observable<Product>;

  constructor(
    protected YotpoService: YotpoService,
    protected elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.product$ = this.YotpoService.getProduct();
  }

  ngAfterViewInit() {
    this.YotpoService.addYotpoInitWidgetsScript(this.elementRef);
  }
}
