/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorModel, OccHttpErrorType, OccHttpErrorReason } from '@spartacus/core';

/**
 * Check if the returned error is of type notFound.
 */
export function isTicketNotFoundError(error: ErrorModel): boolean {
  return (
    error.reason === OccHttpErrorReason.NOT_FOUND_ERROR &&
    error.type === OccHttpErrorType.NOT_FOUND_ERROR &&
    error.message !== undefined &&
    error.message.toLowerCase().startsWith('ticket')
  );
}
