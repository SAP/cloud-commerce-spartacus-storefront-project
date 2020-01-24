import { CmsComponent } from '../../../model/cms.model';
import { PageContext } from '../../../routing/index';
import { StateEntityLoaderActions } from '../../../state/utils/index';
import { COMPONENT_ENTITY } from '../cms-state';

export const LOAD_CMS_COMPONENT = '[Cms] Load Component';
export const LOAD_CMS_COMPONENT_FAIL = '[Cms] Load Component Fail';
export const LOAD_CMS_COMPONENT_SUCCESS = '[Cms] Load Component Success';
// TODO(issue:6027) - rename the const to `CMS_GET_COMPONENT_FROM_PAGE`
export const CMS_GET_COMPONENET_FROM_PAGE = '[Cms] Get Component from Page';

export class LoadCmsComponent extends StateEntityLoaderActions.EntityLoadAction {
  readonly type = LOAD_CMS_COMPONENT;
  // TODO(issue:6027) - this action should have only one `payload` property which should encapsulate all of the constructor's arguments
  constructor(public payload: string, public pageContext?: PageContext) {
    super(COMPONENT_ENTITY, payload);
  }
}

export class LoadCmsComponentFail extends StateEntityLoaderActions.EntityFailAction {
  readonly type = LOAD_CMS_COMPONENT_FAIL;
  // TODO(issue:6027) - this action should have only one `payload` property which should encapsulate all of the constructor's arguments
  constructor(
    uid: string,
    public payload: any,
    public pageContext?: PageContext
  ) {
    super(COMPONENT_ENTITY, uid, payload);
  }
}

export class LoadCmsComponentSuccess<
  T extends CmsComponent
> extends StateEntityLoaderActions.EntitySuccessAction {
  readonly type = LOAD_CMS_COMPONENT_SUCCESS;
  // TODO(issue:6027) - this action should have only one `payload` property which should encapsulate all of the constructor's arguments
  constructor(
    public payload: T,
    uid?: string,
    public pageContext?: PageContext
  ) {
    super(COMPONENT_ENTITY, uid || payload.uid || '');
  }
}

export class CmsGetComponentFromPage<
  T extends CmsComponent
> extends StateEntityLoaderActions.EntitySuccessAction {
  readonly type = CMS_GET_COMPONENET_FROM_PAGE;
  // TODO(issue:6027) - this action should have only one `payload` property which should encapsulate all of the constructor's arguments
  constructor(public payload: T[], public pageContext?: PageContext) {
    super(COMPONENT_ENTITY, payload.map(cmp => cmp.uid));
  }
}

// action types
export type CmsComponentAction<T extends CmsComponent> =
  | LoadCmsComponent
  | LoadCmsComponentFail
  | LoadCmsComponentSuccess<T>
  | CmsGetComponentFromPage<T>;
