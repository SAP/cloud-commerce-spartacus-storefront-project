/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpParams } from '@angular/common/http';
import { Address } from './address.model';

export interface Currency {
  active?: boolean;
  isocode?: string;
  name?: string;
  symbol?: string;
}

export interface Time {
  formattedHour?: string;
  hour?: number;
  minute?: number;
}

export interface GeoPoint {
  latitude?: number;
  longitude?: number;
}

export interface Language {
  active?: boolean;
  isocode?: string;
  name?: string;
  nativeName?: string;
}

export interface Principal {
  name?: string;
  uid?: string;
}

export interface User {
  currency?: Currency;
  customerId?: string;
  deactivationDate?: Date;
  defaultAddress?: Address;
  displayUid?: string;
  firstName?: string;
  language?: Language;
  lastName?: string;
  name?: string;
  title?: string;
  titleCode?: string;
  uid?: string;
  roles?: string[];
}

export interface ListModel {
  ids: string[];
  pagination?: PaginationModel;
  sorts?: SortModel[];
}

// TODO(#8875): Do we need it here?
export interface EntitiesModel<T> {
  values: T[];
  pagination?: PaginationModel;
  sorts?: SortModel[];
}

export interface PaginationModel {
  currentPage?: number;
  pageSize?: number;
  sort?: string;
  totalPages?: number;
  totalResults?: number;
}

export interface SortModel {
  code?: string;
  name?: string;
  selected?: boolean;
}

export interface Title {
  code?: string;
  name?: string;
}

export interface ErrorModel {
  message?: string;
  reason?: string;
  subject?: string;
  subjectType?: string;
  type?: string;
}

export class HttpErrorModel {
  message?: string;
  status?: number;
  statusText?: string;
  url?: string | null;
  details?: ErrorModel[];
}

export interface BaseStore {
  currencies?: Currency[];
  defaultCurrency?: Currency;
  languages?: Language[];
  defaultLanguage?: Language;
}

export interface BaseSite {
  channel?: string;
  defaultLanguage?: Language;
  defaultPreviewCatalogId?: string;
  defaultPreviewCategoryCode?: string;
  defaultPreviewProductCode?: string;
  locale?: string;
  name?: string;
  theme?: string;
  uid?: string;
  stores?: BaseStore[];
  urlPatterns?: string[];
  urlEncodingAttributes?: string[];
  baseStore?: BaseStore;
}

/**
 * An extendable interface with options which are
 * common for all the "options interfaces", e.g. "AddEntryOptions"
 */
export interface CommonOptions {}

/**
 * Used when creating OCC HTTP calls.
 *
 * The types match angular's http typings.
 *
 * Properties from `body` are put into the HTTP's body.
 * `urlParams` are used as HTTP parameters.
 * `params` are used as query parameters.
 */
export interface HttpOptions {
  urlParams: Record<string, string | number | boolean>;
  body: any | null;
  params:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >
    | object;
}

/**
 * A common interface for all the options objects.
 * Intended to be extended / augmented.
 */
export interface CommonOptions {}
