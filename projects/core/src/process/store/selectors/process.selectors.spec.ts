import { TestBed } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import { PROCESS_STATE } from '../process-state';
import * as fromReducers from '../reducers';

describe('Process selectors', () => {
  // let store: Store<ProcessState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(PROCESS_STATE, fromReducers.getReducers())
      ]
    });
  });

  describe('getUpdateUserDetailsState', () => {
    it('should return the default state', () => {
      // to be finished
    });
  });
});
