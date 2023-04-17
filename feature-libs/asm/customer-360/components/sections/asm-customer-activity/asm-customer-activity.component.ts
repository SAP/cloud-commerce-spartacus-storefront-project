/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Customer360ActivityList } from '@spartacus/asm/customer-360/root';
import { UrlCommand } from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerTableColumn } from '../../asm-customer-table/asm-customer-table.model';
import { Customer360SectionContext } from '../customer-360-section-context.model';
import { ActivityEntry } from './asm-customer-activity.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-activity',
  templateUrl: './asm-customer-activity.component.html',
})
export class AsmCustomerActivityComponent implements OnInit {
  entries$: Observable<Array<ActivityEntry>>;
  columns: Array<CustomerTableColumn> = [
    {
      property: 'typeLabel',
      i18nTextKey: 'customer360.activity.type',
    },
    {
      property: 'associatedTypeId',
      text: 'id',
      i18nTextKey: 'customer360.activity.id',
      navigatable: true,
    },
    {
      property: 'description',
      text: 'description',
      i18nTextKey: 'customer360.activity.description',
    },
    {
      property: 'statusLabel',
      text: 'status',
      i18nTextKey: 'customer360.activity.status',
    },
    {
      property: 'createdAt',
      text: 'created',
      i18nTextKey: 'customer360.activity.created',
      isDate: true,
    },
    {
      property: 'updatedAt',
      text: 'updated',
      i18nTextKey: 'customer360.activity.updated',
      isDate: true,
    },
  ];

  constructor(
    protected context: Customer360SectionContext<Customer360ActivityList>
  ) {}

  ngOnInit(): void {
    let entries: Array<ActivityEntry> = [];

    this.entries$ = combineLatest([this.context.data$]).pipe(
      map(([data]) => {
        entries = [];
        data.activities.forEach((activity) => {
          entries.push({
            ...activity,
            typeLabel: activity.type?.name,
            statusLabel: activity.status?.name,
          });
        });
        return entries;
      })
    );
  }

  itemSelected(entry: ActivityEntry | undefined): void {
    if (entry) {
      let urlCommand: UrlCommand;
      if (entry.type?.code === 'savedCart') {
        urlCommand = {
          cxRoute: 'savedCartsDetails',
          params: { savedCartId: entry?.associatedTypeId },
        };
      } else if (entry.type?.code === 'activeCart') {
        urlCommand = {
          cxRoute: 'cart',
        };
      } else if (entry.type?.code === 'orderHistory') {
        urlCommand = {
          cxRoute: 'orderDetails',
          params: { code: entry?.associatedTypeId },
        };
      } else if(entry.type?.code === 'ticket') {
        urlCommand = {
          cxRoute: 'supportTicketDetails',
          params: { code: entry?.associatedTypeId}
        }
      }
      if (urlCommand) {
        this.context.navigate$.next(urlCommand);
      }
    }
  }
}
