import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { AsmConfig, AsmService } from '@spartacus/asm/core';
import {
  AsmCustomer360Data,
  AsmCustomer360Query,
  AsmCustomer360TabConfig,
  AsmDialogActionEvent,
  AsmDialogActionType,
} from '@spartacus/asm/root';
import { UrlCommand, User } from '@spartacus/core';
import { ICON_TYPE, LaunchDialogService } from '@spartacus/storefront';
import { take } from 'rxjs/operators';

import { getAsmDialogActionEvent } from '../../core/utils/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-360',
  templateUrl: './asm-customer-360.component.html',
})
export class AsmCustomer360Component implements OnInit {
  iconTypes = ICON_TYPE;
  loading = false;
  tabs: Array<AsmCustomer360TabConfig>;
  activeTab = 0;
  currentTab: AsmCustomer360TabConfig;
  data: Array<Array<unknown>>;

  customer: User;

  constructor(
    protected asmConfig: AsmConfig,
    protected asmService: AsmService,
    protected injector: Injector,
    protected launchDialogService: LaunchDialogService,
  ) {
    this.tabs = asmConfig.asm?.customer360?.tabs ?? [];
    this.currentTab = this.tabs[0];
  }

  ngOnInit(): void {
    this.launchDialogService.data$.subscribe(data => {
      const customer: User = data.customer;

      this.customer = customer;
      const { customerId } = customer;

      if (customerId) {
        const customerTypeCustomerDataMap: {
          [type: string]: AsmCustomer360Data;
        } = {};

        const queries: Array<AsmCustomer360Query> = [];

        this.tabs.forEach((tab) =>
          tab.components.forEach((component) => {
            if (component.requestData) {
              queries.push(component.requestData);
            }
          })
        );

        this.asmService.fetchCustomer360Data(queries, {
          userId: this.customer.customerId ?? '',
        });

        this.asmService
          .getCustomer360Data()
          .pipe(take(1))
          .subscribe((data) => {
            data.value.forEach((customer360Data) => {
              customerTypeCustomerDataMap[customer360Data.type] = customer360Data;
            });
            this.data = this.tabs.map((tab) => {
              return tab.components.map((component) => component.requestData && customerTypeCustomerDataMap[component.requestData.customer360Type]);
            });
          });
      }
    });
  }

  selectTab(selectedTab: any): void {
    this.activeTab = selectedTab;
    this.currentTab = this.tabs[selectedTab];
  }

  getAvatar(): string {
    return (
      (this.customer.firstName?.charAt(0) || '') +
      (this.customer.lastName?.charAt(0) || '')
    );
  }

  // method to navigate screen and close dialog
  navigateTo(route: UrlCommand): void {
    let event: AsmDialogActionEvent;
    event = getAsmDialogActionEvent(
      this.customer,
      AsmDialogActionType.NAVIGATE,
      route
    );
    this.closeModal(event);
  }

  closeModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }
}
