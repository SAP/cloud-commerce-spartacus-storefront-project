import { Injectable, NgModule } from '@angular/core';
import { Resolve, RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
  RoutingConfig,
} from '@spartacus/core';
import {
  CmsPageGuard,
  OrderEntriesContext,
  PageLayoutComponent,
} from '@spartacus/storefront';
import {
  CART_SAVED_CART_CORE_FEATURE,
  CART_SAVED_CART_FEATURE,
} from './feature-name';
import { SavedCartImportExportContext } from './pages/saved-cart-details-page/saved-cart-import-export-context.service';
import { NewSavedCartImportContext } from './pages/saved-carts-page/new-saved-cart-import-context.service';

// TODO: Inline this factory when we start releasing Ivy compiled libraries
export function defaultCartSavedCartComponentsConfig(): CmsConfig {
  const config: CmsConfig = {
    featureModules: {
      [CART_SAVED_CART_FEATURE]: {
        cmsComponents: [
          'AddToSavedCartsComponent',
          'AccountSavedCartHistoryComponent',
          'SavedCartDetailsOverviewComponent',
          'SavedCartDetailsItemsComponent',
          'SavedCartDetailsActionComponent',
        ],
      },
      // by default core is bundled together with components
      [CART_SAVED_CART_CORE_FEATURE]: CART_SAVED_CART_FEATURE,
    },
  };
  return config;
}

@Injectable({ providedIn: 'root' })
export class SavedCartsPageContextResolver
  implements Resolve<OrderEntriesContext> {
  constructor(protected orderEntriesContext: SavedCartImportExportContext) {}
  resolve = () => ({ orderEntries: this.orderEntriesContext });
}

@Injectable({ providedIn: 'root' })
export class SavedCartDetailsPageContextResolver
  implements Resolve<OrderEntriesContext> {
  constructor(protected orderEntriesContext: NewSavedCartImportContext) {}
  resolve = () => ({ orderEntries: this.orderEntriesContext });
}
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        // @ts-ignore
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'savedCartsDetails' },
        resolve: { cxContext: SavedCartDetailsPageContextResolver },
      },
      {
        // @ts-ignore
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'savedCarts' },
        resolve: { cxContext: SavedCartsPageContextResolver },
      },
    ]),
  ],
  providers: [
    provideDefaultConfigFactory(defaultCartSavedCartComponentsConfig),
    provideDefaultConfig(<RoutingConfig>{
      routing: {
        routes: {
          savedCarts: {
            paths: ['my-account/saved-carts'],
          },
          savedCartsDetails: {
            paths: ['my-account/saved-cart/:savedCartId'],
            paramsMapping: { savedCartId: 'savedCartId' },
          },
        },
      },
    }),
  ],
})
export class SavedCartRootModule {}
