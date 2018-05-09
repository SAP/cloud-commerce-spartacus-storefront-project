import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
  ActionReducer,
  MemoizedSelector
} from '@ngrx/store';

import * as fromPage from './page.reducer';
import * as fromComponent from './component.reducer';
import * as fromNavigation from './navigation-entry-item.reducer';

export interface CmsState {
  page: fromPage.PageState;
  component: fromComponent.ComponentState;
  navigation: fromNavigation.NavigationItemState;
}

export const reducers: ActionReducerMap<CmsState> = {
  page: fromPage.reducer,
  component: fromComponent.reducer,
  navigation: fromNavigation.reducer
};

export const getCmsState: MemoizedSelector<
  any,
  CmsState
> = createFeatureSelector<CmsState>('cms');

export function clearCmsState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    if (
      action.type === '[Site-context] Language Change' ||
      action.type === '[User] Logout' ||
      action.type === '[User] Login'
    ) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearCmsState];
