import * as fromAction from '../actions/page.action';

export const initialState = undefined;

export function reducer(
  entityType: string
): (
  state: string,
  action:
    | fromAction.LoadPageDataSuccess
    | fromAction.LoadPageDataFail
    | fromAction.SetPageFailIndex
) => string {
  return (
    state = initialState,
    action:
      | fromAction.LoadPageDataSuccess
      | fromAction.LoadPageDataFail
      | fromAction.SetPageFailIndex
  ): string => {
    if (action.meta && action.meta.entityType === entityType) {
      switch (action.type) {
        case fromAction.LOAD_PAGE_DATA_SUCCESS: {
          return action.payload.pageId;
        }

        case fromAction.LOAD_PAGE_DATA_FAIL: {
          return initialState;
        }

        case fromAction.SET_PAGE_FAIL_INDEX: {
          return action.payload;
        }
      }
    }
    return state;
  };
}
