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
import { inspect } from 'util';

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
 * Validates that all lines starting with `{` are valid JSON objects.
 * Otherwise it throws an error.
 *
 * Note: multi-line JSONs (printed by SSR in dev mode) cannot be parsed by `JSON.parse`.
 *       That's why we need to to run SSR in prod mode to get single line JSON logs.
 */
function validateJsonsInLogs(logs: string[]): void {
  logs.forEach((text) => {
    if (text.charAt(0) === '{') {
      try {
        JSON.parse(text);
      } catch (error) {
        throw new Error(
          `Encountered in SSR Logs a line starting with \`{\` that could not be parsed as JSON.
          Perhaps its a multi-line JSON log from SSR dev mode.
          Please make sure to build Spartacus SSR in prod mode - to get single line JSONs that can be parsed in tests.`
        );
      }
    }
  });
}

/**
 * Returns raw logs as an array of strings.
 *
 * Note: Non-JSON log entries are also included in the returned array.
 *
 * It also validates whether each line starting with `{` is a valid JSON object.
 * Otherwise it throws an error.
 */
export function getRawLogs(): string[] {
  const data = fs.readFileSync(SSR_LOG_PATH).toString();
  const logs = data.toString().split('\n');
  validateJsonsInLogs(logs);
  return logs;
}

/**
 * Returns raw logs as an array of strings, with JSON objects pretty-printed.
 *
 * Note: Non-JSON log entries are also included in the returned array.
 */
export function getRawLogsPretty(): string[] {
  return getRawLogs().map((line) => {
    try {
      const object = JSON.parse(line);
      return inspect(object, { depth: null });
    } catch (_e) {
      // If the line is not a valid JSON, return it as a string
      return line;
    }
  });
}

/**
 * Returns logs as an array of objects, parsed from JSON log entries.
 *
 * Note: Non-JSON log entries are skipped (e.g. 'Node is running on port 4000').
 */
export function getLogsObjects(): object[] {
  return getRawLogs()
    .map((log) => {
      try {
        return JSON.parse(log);
      } catch (_e) {
        return undefined;
      }
    })
    .filter((x): x is object => x !== undefined);
}

/**
 * Returns logs as an array of strings, being the `message` field of each parsed JSON log entry.
 *
 * Note: Non-JSON log entries are skipped (e.g. 'Node is running on port 4000').
 */
export function getLogsMessages(): string[] {
  return getLogsObjects().map((log) => {
    return (log as { message: string }).message;
  });
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
    if (getRawLogs().some((log) => log.includes(text))) {
      return resolve(true);
    }
    return setTimeout(
      () => resolve(waitUntilLogContainsText(text)),
      checkInterval
    );
  });
}

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
      const readableLogs = getRawLogsPretty().join('\n');
      const ssrLogs = `(more context below)\n--- SSR LOGS (with JSONs pretty-printed) ---\n${readableLogs}\n--- SSR LOGS END ---`;

      if (error instanceof Error) {
        // Error's `cause` property is the only property printed by Jest
        // besides `message` that we can utilize for attaching logs.
        // No other custom properties are printed by Jest.
        // See their source code of their function `formatExecError`:
        // https://github.com/jestjs/jest/blob/bd1c6db7c15c23788ca3e09c919138e48dd3b28a/packages/jest-message-util/src/index.ts#L436

        error.cause = ssrLogs;
      } else {
        throw new Error(error as string, { cause: ssrLogs });
      }

      throw error;
    }
  };
}
