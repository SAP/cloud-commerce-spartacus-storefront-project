import { Injectable } from '@angular/core';

export enum StorageSyncType {
  NO_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE
}

@Injectable()
export class ConfigService {
  server = {
    baseUrl: 'https://backoffice.christian-spartacus1-s2-public.model-t.myhybris.cloud',
    occPrefix: '/rest/v2/'
  };

  lang = 'en';
    // UNIVERSAL PLUMB
    // sessionStorage.getItem('language') === null
    //   ? 'en'
    //   : sessionStorage.getItem('language');
  curr = 'USD';
    // UNIVERSAL PLUMB
    // sessionStorage.getItem('currency') === null
    //   ? 'USD'
    //   : sessionStorage.getItem('currency');

  site = {
    baseSite: 'electronics',
    language: this.lang,
    currency: this.curr
  };

  // site = {
  //     baseSite: 'apparel-uk',
  //     language: 'en',
  //     currency: 'GBP'
  // };
  storageSyncType = StorageSyncType.SESSION_STORAGE;

  defaultPageIdForType = {
    ProductPage: ['productDetails'],
    CategoryPage: ['productList', 'productGrid', 'category']
  };

  authentication = {
    client_id: 'mobile_android',
    client_secret: 'secret'
  };

  cmsComponentMapping = {
    CMSLinkComponent: 'LinkComponent',
    SimpleResponsiveBannerComponent: 'ResponsiveBannerComponent',
    SimpleBannerComponent: 'BannerComponent',
    // BreadcrumbComponent:                'BreadcrumbComponent',
    CMSParagraphComponent: 'ParagraphComponent',
    NavigationComponent: 'NavigationComponent',
    FooterNavigationComponent: 'FooterNavigationComponent',
    CategoryNavigationComponent: 'CategoryNavigationComponent',
    ProductAddToCartComponent: 'AddToCartComponent',
    MiniCartComponent: 'MiniCartComponent',
    ProductCarouselComponent: 'ProductCarouselComponent',
    SearchBoxComponent: 'SearchBoxComponent',
    ProductReferencesComponent: 'ProductReferencesComponent',
    // CMSTabParagraphComponent: 'TabParagraphContainerComponent'
    CMSTabParagraphComponent: 'ParagraphComponent'
  };
}
