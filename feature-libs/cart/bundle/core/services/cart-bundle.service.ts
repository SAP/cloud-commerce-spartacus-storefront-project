import { Injectable } from '@angular/core';
import { ActiveCartFacade, MultiCartFacade } from '@spartacus/cart/base/root';
import { Product, ProductService, UserIdService } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { BundleService } from '../facade/bundle.service';
import { BundleProductScope } from '../model';
import { BundleTemplate } from '../model/bundle-template.model';
import { BundleStarter } from '../model/bundle.model';

@Injectable({
  providedIn: 'root',
})
export class CartBundleService {
  protected readonly PRODUCT_SCOPE = BundleProductScope.TEMPLATES;

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected bundleService: BundleService,
    protected productService: ProductService,
    protected multiCartService: MultiCartFacade
  ) {}

  getBundleTemplates(
    productCode: string
  ): Observable<BundleTemplate[] | undefined> {
    return this.productService.get(productCode, this.PRODUCT_SCOPE).pipe(
      switchMap((productBundleScope: Product) => {
        return of(productBundleScope?.bundleTemplates ?? []);
      })
    );
  }

  /**
   * Start bundle
   *
   * @param productCode
   * @param quantity
   * @param templateId
   */
  startBundle(starter: BundleStarter) {
    this.activeCartService
      .getActiveCartId()
      .pipe(take(1))
      .subscribe((cartId) => {
        this.userIdService.takeUserId().subscribe((userId) => {
          this.bundleService.startBundle(cartId, userId, starter);
        });
      });
  }

  /**
   * Get allowed Bundle Products
   *
   * @param entryGroupNumber
   */
  getBundleAllowedProducts(entryGroupNumber: number) {
    this.activeCartService
      .getActiveCartId()
      .pipe(take(1))
      .subscribe((cartId) => {
        this.userIdService.takeUserId().subscribe((userId) => {
          this.bundleService?.getBundleAllowedProducts(
            cartId,
            userId,
            entryGroupNumber
          );
        });
      });
  }
}
