/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaptchaApiConfig } from '../../captcha-api-config';
import { MockCaptchaService } from '../mock-captcha.service';

export const MockCaptchaApiConfig: CaptchaApiConfig = {
  captchaRenderer: MockCaptchaService,
};
