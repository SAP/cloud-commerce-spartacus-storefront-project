/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Comparator } from './sort.model';

/**
 * Sort an object using multiple sort criteria
 */
export function itemsWith<T>(
  ...fns: Array<Comparator<T>>
): (a: T, b: T) => -1 | 0 | 1 {
  return (a: T, b: T) => {
    for (let i = 0; i < fns.length; i++) {
      const result = fns[i](a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}

/**
 * Allows you to compose multiple sort comparators
 */
export const byMultiple = itemsWith;
