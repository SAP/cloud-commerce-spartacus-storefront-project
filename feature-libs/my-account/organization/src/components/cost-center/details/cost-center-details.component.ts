import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { CostCenter, CostCenterService } from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { CurrentCostCenterService } from '../current-cost-center.service';

@Component({
  selector: 'cx-cost-center-details',
  templateUrl: './cost-center-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrentCostCenterService],
})
export class CostCenterDetailsComponent {
  /**
   * The model of the current cost center.
   *
   * It reloads the model when the code of the current cost center changes.
   */
  costCenter$: Observable<
    CostCenter
  > = this.currentCostCenterService.code$.pipe(
    tap((code) => this.costCenterService.load(code)),
    switchMap(() => this.currentCostCenterService.model$),
    // we have side effects here, we want the to run only once
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    protected currentCostCenterService: CurrentCostCenterService,
    protected costCenterService: CostCenterService,
    // TODO: consider relying on css only
    protected modalService: ModalService
  ) {}

  update(costCenter: CostCenter) {
    this.costCenterService.update(costCenter.code, costCenter);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalService.open(template, {
      centered: true,
    });
  }
}
