/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageContext } from '../../../routing/index';
import { StateUtils } from '../../../state/utils/index';
import { Page } from '../../model/page.model';
import { ErrorActionType } from '../../../model/index';

export const LOAD_CMS_PAGE_DATA = '[Cms] Load Page Data';
export const LOAD_CMS_PAGE_DATA_FAIL = '[Cms] Load Page Data Fail';
export const LOAD_CMS_PAGE_DATA_SUCCESS = '[Cms] Load Page Data Success';
export const CMS_SET_PAGE_SUCCESS_INDEX = '[Cms] Set Page Success Index';
export const CMS_SET_PAGE_FAIL_INDEX = '[Cms] Set Page Fail Index';

export class LoadCmsPageData extends StateUtils.EntityLoadAction {
  readonly type = LOAD_CMS_PAGE_DATA;

  constructor(public payload: PageContext) {
    super(payload.type ?? '', payload.id);
  }
}

export class LoadCmsPageDataFail extends StateUtils.EntityFailAction {
  readonly type = LOAD_CMS_PAGE_DATA_FAIL;

  constructor(pageContext: PageContext, public error: ErrorActionType) {
    super(pageContext.type ?? '', pageContext.id, error);
  }
}

export class LoadCmsPageDataSuccess extends StateUtils.EntitySuccessAction {
  readonly type = LOAD_CMS_PAGE_DATA_SUCCESS;

  constructor(pageContext: PageContext, payload: Page) {
    super(pageContext.type ?? '', pageContext.id, payload);
  }
}

export class CmsSetPageSuccessIndex extends StateUtils.EntitySuccessAction {
  readonly type = CMS_SET_PAGE_SUCCESS_INDEX;

  constructor(pageContext: PageContext, payload: Page) {
    super(pageContext.type ?? '', pageContext.id, payload);
  }
}

export class CmsSetPageFailIndex extends StateUtils.EntityFailAction {
  readonly type = CMS_SET_PAGE_FAIL_INDEX;

  constructor(pageContext: PageContext, public payload: string) {
    super(
      pageContext.type ?? '',
      pageContext.id,
      new Error('Failed to set cms page index')
    );
  }
}

// action types
export type CmsPageAction =
  | LoadCmsPageData
  | LoadCmsPageDataFail
  | LoadCmsPageDataSuccess
  | CmsSetPageFailIndex;
