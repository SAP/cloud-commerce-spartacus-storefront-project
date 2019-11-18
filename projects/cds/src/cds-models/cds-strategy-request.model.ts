/**
 * A model class that is used when sending a request to the Context-Driven Services Merchandising Strategy service for returning
 * products for a carousel. There are a number of things that can affect which products are returned, based on the users current
 * context
 */
export interface StrategyRequest {
  productId?: string;
  category?: string;
  facets?: string;
  date?: string;
  userId?: string;
  site?: string;
  language?: string;
  pageNumber?: number;
  pageSize?: number;
}
