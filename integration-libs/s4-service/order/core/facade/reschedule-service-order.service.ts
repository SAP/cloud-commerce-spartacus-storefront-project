/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { UserIdService } from '@spartacus/core';
import {
  RescheduleServiceOrderFacade,
  ServiceDateTime,
} from '@spartacus/s4-service/root';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RescheduleServiceOrderConnector } from '../connector';

@Injectable({
  providedIn: 'root',
})
export class RescheduleServiceOrderService
  implements RescheduleServiceOrderFacade
{
  protected rescheduleServiceOrderConnector = inject(
    RescheduleServiceOrderConnector
  );
  protected userIdService = inject(UserIdService);

  rescheduleService(
    orderCode: string,
    scheduledAt: ServiceDateTime
  ): Observable<unknown> {
    return this.userIdService.takeUserId().pipe(
      switchMap((userId) => {
        return this.rescheduleServiceOrderConnector.rescheduleServiceOrder(
          userId,
          orderCode,
          { scheduledAt }
        );
      })
    );
  }
}
