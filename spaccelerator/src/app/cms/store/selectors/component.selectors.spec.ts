import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRoot from '../../../routing/store';
import * as fromReducers from '../reducers';
import * as fromActions from '../actions';
import * as fromSelectors from '../selectors/component.selectors';

describe('Cms Component Selectors', () => {
  let store: Store<fromReducers.CmsState>;

  const component = { uid: 'comp1', typeCode: 'SimpleBannerComponent' };
  const entities = {
    comp1: component
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          cms: combineReducers(fromReducers.reducers)
        })
      ]
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getComponentEntities', () => {
    it('should return components as entities', () => {
      let result;

      store
        .select(fromSelectors.getComponentEntities)
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadComponentSuccess(component));

      expect(result).toEqual(entities);
    });
  });

  describe('componentSelectorFactory', () => {
    it('should return component by uid', () => {
      let result;

      store
        .select(fromSelectors.componentSelectorFactory('comp1'))
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.LoadComponentSuccess(component));

      expect(result).toEqual(entities['comp1']);
    });
  });
});
