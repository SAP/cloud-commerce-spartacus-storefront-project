import { CmsComponent } from '@spartacus/core';

export type ProductsData = {
  productCode: string;
  quantity: number;
}[];

export interface InvalidFileInfo {
  tooLarge?: { maxSize: number };
  empty?: boolean;
  notParsable?: boolean;
}

export interface FileValidity {
  // size unit is MB
  maxSize?: number;
  allowedExtensions?: string[];
}

export enum ProductImportStatus {
  SUCCESS = 'success',
  LOW_STOCK = 'lowStock',
  NO_STOCK = 'noStock',
  UNKNOWN_IDENTIFIER = 'unknownIdentifier',
  UNKNOWN_ERROR = 'unknownError',
}

export interface ProductImportInfo {
  productCode: string;
  statusCode: ProductImportStatus;
  productName?: string;
  quantity?: number;
  quantityAdded?: number;
}

export interface ProductImportSummary {
  loading: boolean;
  cartName: string | undefined;
  count: number;
  total: number;
  successesCount: number;
  warningMessages: ProductImportInfo[];
  errorMessages: ProductImportInfo[];
}

export enum NameSource {
  FILE_NAME = 'fileName',
  DATE_TIME = 'dateTime',
}

export interface CartNameGeneration {
  source?: NameSource;
  fromDateOptions?: {
    prefix?: string;
    suffix?: string;
    mask?: string;
  };
}

export interface CmsImportEntriesComponent extends CmsComponent {
  fileValidity?: FileValidity;
  cartNameGeneration?: CartNameGeneration;
}
