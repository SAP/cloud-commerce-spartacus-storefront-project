import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Cart, CartService } from '@spartacus/core';

@Component({
  selector: 'cx-cart-page-layout',
  templateUrl: './cart-page-layout.component.html',
  styleUrls: ['./cart-page-layout.component.scss']
})
export class CartPageLayoutComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(protected cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartMergeComplete().subscribe(isCartMergeComplete => {
      if (isCartMergeComplete) {
        this.cartService.loadDetails();
      }
    });
    this.cart$ = this.cartService.getActive();
  }
}
