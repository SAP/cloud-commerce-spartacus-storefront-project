import { OccConfig } from '../../config/occ-config';

export const defaultOccProductConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        product:
          'products/${productCode}?fields=DEFAULT,averageRating,images(FULL),classifications,manufacturer,numberOfReviews,categories(FULL),baseOptions,baseProduct,variantOptions,variantType',
        product_scopes: {
          list:
            'products/${productCode}?fields=code,name,summary,price(formattedValue),images(DEFAULT,galleryIndex)',
          details:
            'products/${productCode}?fields=averageRating,purchasable,stock(DEFAULT),description,variantMatrix(DEFAULT),baseOptions(DEFAULT),baseProduct,availableForPickup,variantOptions(DEFAULT),variantType,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags,classifications,images(FULL)',
        },
        productReviews: 'products/${productCode}/reviews',
        // Uncomment this when occ gets configured
        // productReferences:
        //   'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))&referenceType=${referenceType}',
        productReferences:
          'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))',
        // tslint:disable:max-line-length
        productSearch:
          'products/search?fields=products(code,name,summary,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch',
        // tslint:enable
        productSuggestions: 'products/suggestions',
      },
    },
    loadingScopes: {
      product: {
        details: {
          include: ['list'],
        },
      },
    },
  },
};
