/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CostCenter } from '@spartacus/core';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { CostCenterItemService } from '../services/cost-center-item.service';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { ItemExistsDirective } from '../../shared/item-exists.directive';
import { DisableInfoComponent } from '../../shared/detail/disable-info/disable-info.component';
import { ToggleStatusComponent } from '../../shared/detail/toggle-status-action/toggle-status.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FocusDirective } from '@spartacus/storefront';
import { CardComponent } from '../../shared/card/card.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-org-cost-center-details',
  templateUrl: './cost-center-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ItemService,
      useExisting: CostCenterItemService,
    },
  ],
  host: { class: 'content-wrapper' },
  standalone: true,
  imports: [
    NgIf,
    CardComponent,
    FocusDirective,
    RouterLink,
    ToggleStatusComponent,
    DisableInfoComponent,
    ItemExistsDirective,
    RouterLinkActive,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class CostCenterDetailsComponent {
  model$: Observable<CostCenter> = this.itemService.key$.pipe(
    switchMap((code) => this.itemService.load(code)),
    startWith({})
  );
  isInEditMode$ = this.itemService.isInEditMode$;

  constructor(protected itemService: ItemService<CostCenter>) {}
}
