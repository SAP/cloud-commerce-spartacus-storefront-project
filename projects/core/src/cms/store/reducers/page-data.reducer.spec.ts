import * as fromActions from '../actions/page.action';
import { PageContext } from '../../../routing';
import { Page } from '../../model/page.model';

import * as fromPage from './page-data.reducer';
import { PageType } from '../../../model/cms.model';

describe('Cms Page Data Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromPage;
      const action = {} as fromActions.LoadPageDataSuccess;
      const state = fromPage.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('ADD_PAGEDATA_SUCCESS action', () => {
    it('should populate the page state', () => {
      const pageContext: PageContext = {
        id: 'homepage',
        type: PageType.CONTENT_PAGE,
      };
      const page = {
        pageId: 'homepage',
        name: 'testPage',
      } as Page;

      const { initialState } = fromPage;
      const action = new fromActions.LoadPageDataSuccess(pageContext, page);
      const state = fromPage.reducer(initialState, action);

      expect(state).toEqual({
        entities: {
          [page.pageId]: page,
        },
      });
    });
  });
});
