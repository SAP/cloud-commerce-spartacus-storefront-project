import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { OrgUnitService, RoutingService } from '@spartacus/core';
import { ModalService } from '@spartacus/storefront';
import { CurrentUnitService } from '../current-unit.service';
import { CurrentUnitAddressService } from './current-unit-address.service';

@Component({
  selector: 'cx-unit-address-details',
  templateUrl: './unit-address-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrentUnitAddressService],
})
export class UnitAddressDetailsComponent {
  addressId: string;
  code$ = this.currentUnitService.code$;
  address$ = this.currentUnitAddressService.unitAddress$;

  constructor(
    protected routingService: RoutingService,
    protected orgUnitsService: OrgUnitService,
    protected modalService: ModalService,
    protected currentUnitService: CurrentUnitService,
    protected currentUnitAddressService: CurrentUnitAddressService
  ) {}

  openModal(address, template: TemplateRef<any>): void {
    this.addressId = address.id;
    this.modalService.open(template, {
      centered: true,
    });
  }

  deleteAddress() {
    this.code$.pipe(take(1)).subscribe((code) => {
      this.orgUnitsService.deleteAddress(code, this.addressId);
      this.routingService.go({
        cxRoute: 'orgUnitManageAddresses',
        params: { uid: code },
      });
    });
  }
}
