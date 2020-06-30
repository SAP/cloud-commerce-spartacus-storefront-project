import { Component, OnInit } from '@angular/core';
import {
  CostCenter,
  CostCenterService,
  EntitiesModel,
  RoutingService,
} from '@spartacus/core';
import { AbstractListingComponent, ListingModel } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-cost-center-list',
  templateUrl: './cost-center-list.component.html',
})
export class CostCenterListComponent extends AbstractListingComponent
  implements OnInit {
  cxRoute = 'costCenters';

  constructor(
    protected routingService: RoutingService,
    protected costCentersService: CostCenterService
  ) {
    super(routingService);
  }

  ngOnInit(): void {
    this.data$ = <Observable<ListingModel>>this.queryParams$.pipe(
      tap((params) => this.costCentersService.loadCostCenters(params)),
      switchMap((params) =>
        this.costCentersService.getList(params).pipe(
          filter(Boolean),
          map((costCentersList: EntitiesModel<CostCenter>) => ({
            sorts: costCentersList.sorts,
            pagination: costCentersList.pagination,
            values: costCentersList.values.map((costCenter) => ({
              code: costCenter.code,
              name: costCenter.name,
              currency: costCenter.currency && costCenter.currency.isocode,
              parentUnit: costCenter.unit && costCenter.unit.name,
              uid: costCenter.unit && costCenter.unit.uid,
            })),
          }))
        )
      )
    );
  }
}
