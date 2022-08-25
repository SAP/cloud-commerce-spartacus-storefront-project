import { formatDate } from '@angular/common';

import { KeyValuePair } from './asm-customer-360.model';

export function replaceTokens(
  text?: string,
  tokens?: Array<KeyValuePair>
): string | undefined {
  return tokens?.length
    ? tokens.reduce((currentText, currentTokenValue) => {
        return currentText?.replace(
          `\${${currentTokenValue.key}}`,
          currentTokenValue.value
        );
      }, text)
    : text;
}

export function formatEpochTime(time: number): string {
  return formatDate(time, 'dd-MM-yy hh:mm a', 'en-US');
}

export function combineStrings(
  string1?: string,
  string2?: string,
  delimiter: string = ''
): string | undefined {
  return string1 || string2
    ? `${string1 || ''}${delimiter}${string2 || ''}`
    : undefined;
}

export function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
