import { Translation } from '../../i18n/translation';

export enum GlobalMessageType {
  MSG_TYPE_CONFIRMATION = '[GlobalMessage] Confirmation',
  MSG_TYPE_ERROR = '[GlobalMessage] Error',
  MSG_TYPE_INFO = '[GlobalMessage] Information',
}

export interface GlobalMessage {
  text: Translation;
  type: GlobalMessageType;
}

export interface GlobalMessageInput {
  text: string | GlobalMessageInputTranslation;
  type: GlobalMessageType;
}

export interface GlobalMessageInputTranslation {
  key: string;
  params?: { [param: string]: any };
}
