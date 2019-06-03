import { GlobalMessageAction } from '../actions/global-message.actions';
import {
  GlobalMessage,
  GlobalMessageType,
} from '../../models/global-message.model';
import * as fromAction from '../actions/index';
import { GlobalMessageState } from '../global-message-state';
import { Translatable } from '../../../i18n/translatable';
import { deepEqualObjects } from '../../../util/compare-equal-objects';

export const initialState: GlobalMessageState = {
  entities: {},
};

export function reducer(
  state = initialState,
  action: GlobalMessageAction
): GlobalMessageState {
  switch (action.type) {
    case fromAction.ADD_MESSAGE: {
      const message: GlobalMessage = action.payload;

      if (state.entities[message.type] === undefined) {
        return {
          ...state,
          entities: {
            ...state.entities,
            [message.type]: [message.text],
          },
        };
      } else {
        const messages: Translatable[] = state.entities[message.type];
        if (!messages.some(msg => deepEqualObjects(msg, message.text))) {
          return {
            ...state,
            entities: {
              ...state.entities,
              [message.type]: [...messages, message.text],
            },
          };
        }
      }
      return state;
    }

    case fromAction.REMOVE_MESSAGE: {
      const msgType: GlobalMessageType = action.payload.type;
      const msgIndex: number = action.payload.index;
      if (
        Object.keys(state.entities).length === 0 ||
        !state.entities[msgType]
      ) {
        return state;
      }

      const messages = [...state.entities[msgType]];
      messages.splice(msgIndex, 1);

      return {
        ...state,
        entities: {
          ...state.entities,
          [msgType]: messages,
        },
      };
    }

    case fromAction.REMOVE_MESSAGES_BY_TYPE: {
      const entities = {
        ...state.entities,
        [action.payload]: [],
      };
      return {
        ...state,
        entities,
      };
    }
  }

  return state;
}
