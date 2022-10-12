import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnInit,
  StaticProvider,
} from '@angular/core';
import { AsmService } from '@spartacus/asm/core';
import {
  AsmConfig,
  AsmCustomer360Data,
  AsmCustomer360Query,
  AsmCustomer360TabConfig,
  AsmDialogActionEvent,
  AsmDialogActionType,
  Customer360SectionConfig,
  Customer360SectionData,
} from '@spartacus/asm/root';
import { UrlCommand, User } from '@spartacus/core';
import { ICON_TYPE, LaunchDialogService } from '@spartacus/storefront';
import { take } from 'rxjs/operators';

import { getAsmDialogActionEvent } from '../../core/utils/utils';
import { Customer360SectionContextSource } from './sections/customer-360-section-context-source.model';
import { Customer360SectionContext } from './sections/customer-360-section-context.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-360',
  templateUrl: './asm-customer-360.component.html',
  providers: [
    Customer360SectionContextSource,
    {
      provide: Customer360SectionContext,
      useExisting: Customer360SectionContextSource,
    },
  ],
})
export class AsmCustomer360Component implements OnInit {
  iconTypes = ICON_TYPE;
  loading = false;
  tabs: Array<AsmCustomer360TabConfig>;
  activeTab = 0;
  currentTab: AsmCustomer360TabConfig;
  injectors: Array<Array<Injector>>;

  constructor(
    asmConfig: AsmConfig,
    protected asmService: AsmService,
    protected injector: Injector,
    protected dialogService: LaunchDialogService
  ) {
    this.tabs = asmConfig.asm?.customer360?.tabs ?? [];
    this.currentTab = this.tabs[0];
  }

  @Input() customer: User;

  ngOnInit(): void {
    const { customerId } = this.customer;

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
          this.injectors = this.tabs.map((tab) => {
            return tab.components.map((component) =>
              this.createInjector(
                component.config,
                component.requestData &&
                  customerTypeCustomerDataMap[
                    component.requestData.customer360Type
                  ]
              )
            );
          });
        });
    }
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
    reason;
    // TODO
    // this.modalService.closeActiveModal(reason);
  }

  createInjector(config: unknown, sectionData?: unknown): Injector {
    const providers: Array<StaticProvider> = [
      { provide: Customer360SectionConfig, useValue: config },
    ];

    if (sectionData) {
      providers.push({
        provide: Customer360SectionData,
        useValue: new Customer360SectionData(sectionData),
      });
    }

    return Injector.create({
      providers,
      parent: this.injector,
    });
  }
}
