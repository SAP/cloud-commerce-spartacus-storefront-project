/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { AbstractOrderType } from '@spartacus/cart/base/root';

import { Observable } from 'rxjs';

/**
 * Context for transporting information about an abstract order (active cart, saved cart, order, quote).
 */
@Injectable()
export abstract class AbstractOrderContext {
  readonly type$: Observable<AbstractOrderType>;
  readonly id$: Observable<string | undefined>;
}
