import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListService } from '../../../shared/list/list.service';
import { UnitCostCenterListService } from './unit-cost-centers.service';

@Component({
  selector: 'cx-org-unit-cost-centers',
  templateUrl: './unit-cost-centers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UnitCostCenterListService,
    },
  ],
})
export class UnitCostCenterListComponent {}
