import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { CostCenter, CostCenterService, RoutingService } from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-cost-center-details',
  templateUrl: './cost-center-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterDetailsComponent {
  /**
   * The model of the current cost center.
   *
   * It reloads the model when the code of the current cost center changes.
   */
  costCenter$: Observable<CostCenter> = this.routingService.getParams().pipe(
    map((params) => params['costCenterKey']),
    tap((code) => this.costCenterService.load(code)),
    switchMap((code) => this.costCenterService.get(code)),
    shareReplay({ bufferSize: 1, refCount: true }) // we have side effects here, we want the to run only once
  );

  constructor(
    protected routingService: RoutingService,
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
