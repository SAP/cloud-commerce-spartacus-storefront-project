import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import { UnitAssignRolesComponent } from './unit-assign-roles.component';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { InteractiveTableModule } from '../../../../shared/components/interactive-table/interactive-table.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FakeTabsModule } from '../../fake-tabs/fake-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'orgUnitAssignRoles' },
      },
    ]),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        UnitAssignRolesComponent: {
          component: UnitAssignRolesComponent,
          guards: [AuthGuard],
        },
      },
    }),
    UrlModule,
    I18nModule,
    InteractiveTableModule,
    NgSelectModule,
    FormsModule,
    FakeTabsModule,
  ],
  declarations: [UnitAssignRolesComponent],
  exports: [UnitAssignRolesComponent],
  providers: [],
  entryComponents: [UnitAssignRolesComponent],
})
export class UnitAssignRolesModule {}
