import { User } from '../../../occ/occ-models/index';
import * as fromUpdateEmailAction from '../actions/update-email.action';
import * as fromUserDetailsAction from '../actions/user-details.action';

export const initialState: User = <User>{};

export function reducer(
  state = initialState,
  action:
    | fromUserDetailsAction.UserDetailsAction
    | fromUpdateEmailAction.EmailActions
): User {
  switch (action.type) {
    case fromUserDetailsAction.LOAD_USER_DETAILS_SUCCESS: {
      return action.payload;
    }
    case fromUpdateEmailAction.UPDATE_EMAIL_SUCCESS: {
      const updatedUserId: User = {
        ...state,
        ...action.newUserId,
      };

      return {
        ...updatedUserId,
        uid: `${updatedUserId.uid}`,
        displayUid: `${updatedUserId.displayUid}`,
      };
    }
  }
  return state;
}
