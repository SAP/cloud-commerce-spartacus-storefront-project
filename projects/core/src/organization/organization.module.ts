import { ModuleWithProviders, NgModule } from '@angular/core';
import { BudgetService } from './facade/budget.service';
import { OrgUnitService } from './facade/org-unit.service';
import { PermissionService } from './facade/permission.service';
import { CostCenterService } from './facade/cost-center.service';
import { OrganizationStoreModule } from './store/organization-store.module';
import { B2BUserService } from './facade/b2b-user.service';
import { UserGroupService } from './facade/user-group.service';
import { PageMetaResolver } from '../cms/page/page-meta.resolver';
import { OrganizationMetaResolver } from './services/organization-meta.resolver';
import { OrderApprovalService } from './facade/order-approval.service';

@NgModule({
  imports: [OrganizationStoreModule],
})
export class OrganizationModule {
  static forRoot(): ModuleWithProviders<OrganizationModule> {
    return {
      ngModule: OrganizationModule,
      providers: [
        BudgetService,
        OrgUnitService,
        UserGroupService,
        PermissionService,
        CostCenterService,
        B2BUserService,
        {
          provide: PageMetaResolver,
          useExisting: OrganizationMetaResolver,
          multi: true,
        },
        OrderApprovalService,
      ],
    };
  }
}
