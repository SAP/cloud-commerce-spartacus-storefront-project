import { Category, Price } from '@spartacus/core';

/**
 * Indicates that a user visited a product details page. A visited product code value is emitted whenever the product
 * details page is visited, together with the name, the price, and the categories of that product.
 */
export class ProductDetailsPageVisited {
  categories?: Category[];
  code?: string;
  name?: string;
  price?: Price;
}

/**
 * Indicates that a user visited a category. The code and the name of the category
 * are emitted whenever a category page is visited.
 */
export class CategoryPageVisited {
  categoryCode: string;
  categoryName: string;
}

/**
 * Indicates that a user visited brand page. The code and the name of the brand
 * are emitted whenever a category page is visited.
 */
export class BrandPageVisited {
  brandCode: string;
  brandName: string;
}

/**
 * Indicates that the search results have been retrieved.
 * The search term and the number of results are emitted
 * whenever a search has been executed.
 */
export class SearchResultsRetrieved {
  searchTerm: string;
  numberOfResults: Number;
}
