/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { getTestBed } from '@angular/core/testing';
import {
  platformServerTesting,
  ServerTestingModule,
} from '@angular/platform-server/testing';
import 'zone.js';
import 'zone.js/testing';

getTestBed().initTestEnvironment(
  ServerTestingModule,
  platformServerTesting(),
  {}
);
