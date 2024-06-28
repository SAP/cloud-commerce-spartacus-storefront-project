/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import {
  ActionErrorProperty,
  ErrorAction,
} from '../../../error-handling/effects-error-handler/error-action';
import { Language } from '../../../model/misc.model';

export const LOAD_LANGUAGES = '[Site-context] Load Languages';
export const LOAD_LANGUAGES_FAIL = '[Site-context] Load Languages Fail';
export const LOAD_LANGUAGES_SUCCESS = '[Site-context] Load Languages Success';
export const SET_ACTIVE_LANGUAGE = '[Site-context] Set Active Language';
export const LANGUAGE_CHANGE = '[Site-context] Language Change';

export class LoadLanguages implements Action {
  readonly type = LOAD_LANGUAGES;
}

export class LoadLanguagesFail implements ErrorAction {
  readonly type = LOAD_LANGUAGES_FAIL;

  constructor(error: ActionErrorProperty);
  /**
   * @deprecated Please use the `error` parameter with a non-null, non-undefined value.
   *             Support for `null` or `undefined` will be removed in future versions,
   *             along with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing deprecated constructor
    error: any
  );
  constructor(public error: any) {}
}

export class LoadLanguagesSuccess implements Action {
  readonly type = LOAD_LANGUAGES_SUCCESS;

  constructor(public payload: Language[]) {}
}

export class SetActiveLanguage implements Action {
  readonly type = SET_ACTIVE_LANGUAGE;

  constructor(public payload: string) {}
}

export class LanguageChange implements Action {
  readonly type = LANGUAGE_CHANGE;

  constructor(
    public payload: { previous: string | null; current: string | null }
  ) {}
}

// action types
export type LanguagesAction =
  | LoadLanguages
  | LoadLanguagesFail
  | LoadLanguagesSuccess
  | SetActiveLanguage
  | LanguageChange;
