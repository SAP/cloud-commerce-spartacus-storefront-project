/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contains methods pertaining to reading, writing and asserting of the ssr log
 * generated by a running ssr server for the sake of testing ssr.
 */

import * as fs from 'fs';

/**
 * Path where SSR log file from server will be generated and read from.
 */
const SSR_LOG_PATH = './.ssr.log';

/**
 * Writes no characters to log to clear log file.
 */
export function clearSsrLogFile(): void {
  fs.writeFileSync(SSR_LOG_PATH, '');
}

/**
 * Returns all text in the log as a single string.
 */
export function getLogText(): string {
  return fs.readFileSync(SSR_LOG_PATH).toString();
}

/**
 * Reads log and returns them as string array.
 */
export function getLogObjects(): object[] {
  const data = fs.readFileSync(SSR_LOG_PATH).toString();
  return (
    data
      .toString()
      .split('\n')
      // We're interested only in JSON logs from Spartacus SSR app.
      // We ignore plain text logs coming from other sources, like `Node Express server listening on http://localhost:4200`
      .filter((text: string) => text.charAt(0) === '{')
      .map((text: any) => {
        return JSON.parse(text);
      })
  );
}

/**
 * Reads log and returns messages as string array.
 */
export function getLogMessages(): string[] {
  return getLogObjects().map((log) => (log as any).message);
}

/**
 * Check log every interval to see if log contains text.
 * Keeps waiting until log contains text or test times out.
 */
export async function waitUntilLogContainsText(
  text: string,
  checkInterval = 500
): Promise<true> {
  return new Promise((resolve) => {
    if (doesLogContainText(text)) {
      return resolve(true);
    }
    return setTimeout(
      () => resolve(waitUntilLogContainsText(text)),
      checkInterval
    );
  });
}

/**
 * Returns true if log contains string.
 */
export function doesLogContainText(text: string): boolean {
  const data = fs.readFileSync(SSR_LOG_PATH).toString();
  return data.includes(text);
}

import { inspect } from 'util';
import * as LogUtils from './log.utils';

/**
 * A higher-order function that wraps a test callback and includes SSR logs
 * in any error thrown during the test execution. The logs are put into the `cause`
 * property of the Error.
 *
 * @param testFn - The original test function to be wrapped.
 * @returns A new function that can be passed to Jest's `it()` or `test()`.
 *
 * @example
 * it('should perform SSR correctly', attachLogsToErrors(async () => {
 *   // Your test code here
 * }));
 */
export function attachLogsToErrors(
  testFn: () => Promise<void> | void
): () => Promise<void> {
  return async () => {
    try {
      await testFn();
    } catch (error: unknown) {
      const readableLogs = inspect(LogUtils.getLogObjects(), { depth: null });
      const ssrLogs = `(more context below)\n--- SSR LOGS START ---\n${readableLogs}\n--- SSR LOGS END ---`;

      if (error instanceof Error) {
        // Error's `cause` property is the only property printed by Jest
        // besides `message` that we can utilize for attaching logs.
        // No other custom properties are printed by Jest.
        // See their source code of their function `formatExecError`:
        // https://github.com/jestjs/jest/blob/bd1c6db7c15c23788ca3e09c919138e48dd3b28a/packages/jest-message-util/src/index.ts#L235
        error.cause = ssrLogs;
      } else {
        throw new Error(error as string, { cause: ssrLogs });
      }

      throw error;
    }
  };
}
