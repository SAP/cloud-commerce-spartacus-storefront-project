/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewChild,
} from '@angular/core';
import { EntitiesModel } from '@spartacus/core';
import { TableStructure } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ListComponent } from '../list/list.component';
import { MessageService } from '../message/services/message.service';
import { CardComponent } from '../card/card.component';
import { FocusDirective } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';
import { TableComponent } from '@spartacus/storefront';
import { PaginationComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-org-sub-list',
  templateUrl: './sub-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  imports: [
    CardComponent,
    FocusDirective,
    NgIf,
    TableComponent,
    PaginationComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class SubListComponent extends ListComponent {
  hostClass = '';

  @ViewChild(MessageService, { read: MessageService })
  messageService: MessageService;

  @Input() previous: boolean | string = true;

  @Input() key = this.service.key();

  @Input() showHint? = false;

  @Input() set routerKey(key: string) {
    this.subKey$ = this.organizationItemService.getRouterParam(key);
  }

  @HostBinding('class.ghost') hasGhostData = false;

  subKey$: Observable<string>;

  readonly listData$: Observable<EntitiesModel<any> | undefined> =
    this.currentKey$.pipe(
      switchMap((key) => this.service.getData(key)),
      tap((data) => {
        this.hasGhostData = this.service.hasGhostData(data);
      })
    );

  readonly dataStructure$: Observable<TableStructure> =
    this.service.getStructure();
}
