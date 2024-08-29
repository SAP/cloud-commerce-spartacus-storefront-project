/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Provider } from '@angular/core';
import {
  OpfGlobalFunctionsFacade,
  OpfOtpFacade,
  OpfPaymentFacade,
} from '@spartacus/opf/base/root';

import { OpfPaymentHostedFieldsService } from '../services/opf-payment-hosted-fields.service';
import { OpfGlobalFunctionsService } from './opf-global-functions.service';
import { OpfOtpService } from './opf-otp.service';
import { OpfPaymentService } from './opf-payment.service';

export const facadeProviders: Provider[] = [
  OpfPaymentService,
  OpfPaymentHostedFieldsService,
  OpfOtpService,
  OpfGlobalFunctionsService,
  {
    provide: OpfPaymentFacade,
    useExisting: OpfPaymentService,
  },
  {
    provide: OpfOtpFacade,
    useExisting: OpfOtpService,
  },
  {
    provide: OpfGlobalFunctionsFacade,
    useExisting: OpfGlobalFunctionsService,
  },
];
