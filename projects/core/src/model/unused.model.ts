import { PaginationModel, SortModel } from './misc.model';
import { PointOfServiceStock, Product } from './product.model';

export interface CategoryHierarchy {
  id?: string;
  lastModified?: Date;
  name?: string;
  subcategories?: CategoryHierarchy[];
  url?: string;
}

export interface CatalogVersion {
  categories?: CategoryHierarchy[];
  id?: string;
  lastModified?: Date;
  name?: string;
  url?: string;
}

export interface Catalog {
  catalogVersions?: CatalogVersion[];
  id?: string;
  lastModified?: Date;
  name?: string;
  url?: string;
}

export interface Pagination {
  count?: number;
  page?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface Sort {
  asc?: boolean;
  code?: string;
}

export interface ListAdaptedComponents {
  components?: any[];
  pagination?: Pagination;
  sorts?: Sort[];
}

export interface OrderStatusUpdateElement {
  baseSiteId?: string;
  code?: string;
  status?: string;
}

export interface ProductExpressUpdateElement {
  catalogId?: string;
  catalogVersion?: string;
  code?: string;
}

export interface ProductList {
  catalog?: string;
  currentPage?: number;
  products?: Product[];
  totalPageCount?: number;
  totalProductCount?: number;
  version?: string;
}

export interface StoreFinderStockSearchPage {
  boundEastLongitude?: number;
  boundSouthLatitude?: number;
  boundWestLongitude?: number;
  locationText?: string;
  pagination?: PaginationModel;
  product?: Product;
  sorts?: SortModel[];
  sourceLatitude?: number;
  sourceLongitude?: number;
  stores?: PointOfServiceStock[];
}
