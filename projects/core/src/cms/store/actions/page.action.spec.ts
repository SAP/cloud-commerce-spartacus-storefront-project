import {
  entityFailMeta,
  entityLoadMeta,
  entitySuccessMeta,
} from '../../../state';
import { Page } from '../../model/page.model';
import { PageContext } from '../../../routing/index';
import * as fromPage from './page.action';
import { PageType } from '../../../model/cms.model';

describe('Cms Page Actions', () => {
  const pageContext: PageContext = {
    id: 'test',
    type: PageType.CONTENT_PAGE,
  };

  describe('LoadPageData Actions', () => {
    describe('LoadPageData', () => {
      it('should create the action', () => {
        const action = new fromPage.LoadPageData(pageContext);

        expect({ ...action }).toEqual({
          type: fromPage.LOAD_PAGE_DATA,
          meta: entityLoadMeta(pageContext.type, pageContext.id),
          payload: pageContext,
        });
      });
    });

    describe('LoadPageDataFail', () => {
      it('should create the action', () => {
        const payload = 'error';
        const action = new fromPage.LoadPageDataFail(pageContext, payload);

        expect({ ...action }).toEqual({
          type: fromPage.LOAD_PAGE_DATA_FAIL,
          meta: entityFailMeta(pageContext.type, pageContext.id, payload),
        });
      });
    });

    describe('SetPageFailIndex', () => {
      it('should create the action', () => {
        const newIndex = 'index';
        const action = new fromPage.SetPageFailIndex(pageContext, newIndex);

        expect({ ...action }).toEqual({
          payload: newIndex,
          type: fromPage.SET_PAGE_FAIL_INDEX,
          meta: entityFailMeta(pageContext.type, pageContext.id),
        });
      });
    });

    describe('LoadPageDataSuccess', () => {
      it('should create the action', () => {
        const page: Page = <Page>{
          pageId: 'test',
        };
        const action = new fromPage.LoadPageDataSuccess(pageContext, page);

        expect({ ...action }).toEqual({
          type: fromPage.LOAD_PAGE_DATA_SUCCESS,
          meta: entitySuccessMeta(pageContext.type, pageContext.id),
          payload: page,
        });
      });
    });
  });
});
