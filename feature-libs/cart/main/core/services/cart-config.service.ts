import { Injectable } from '@angular/core';
import { CartConfig } from '@spartacus/cart/main/root';

@Injectable({
  providedIn: 'root',
})
export class CartConfigService {
  constructor(protected config: CartConfig) {}

  isSelectiveCartEnabled(): boolean {
    return Boolean(this.config?.cart?.selectiveCart?.enabled);
  }
}
