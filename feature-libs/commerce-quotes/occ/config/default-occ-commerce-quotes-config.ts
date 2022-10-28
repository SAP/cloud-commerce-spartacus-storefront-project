/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccConfig } from '@spartacus/core';

export const defaultOccCommerceQuotesConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        getQuotes: 'users/${userId}/quotes',
        createQuote: 'users/${userId}/quotes',
        getQuote:
          'users/${userId}/quotes/${quoteCode}?fields=FULL,previousEstimatedTotal(formattedValue)',
        editQuote: 'users/${userId}/quotes/${quoteCode}',
        performQuoteAction: 'users/${userId}/quotes/${quoteCode}/action',
        addComment: 'users/${userId}/quotes/${quoteCode}/comments',
        addDiscount: 'users/${userId}/quotes/${quoteCode}/discounts',
        addCartEntryComment:
          'users/${userId}/quotes/${quoteCode}/entries/${entryNumber}/comments',
      },
    },
  },
};
