import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  I18nModule,
} from '@spartacus/core';
import { BudgetEditComponent } from './budget-edit.component';
import { BudgetFormModule } from '../budget-form/budget-form.module';
import { RouterModule } from '@angular/router';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import { FakeTabsModule } from '../../fake-tabs/fake-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'budgetEdit' },
      },
    ]),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        BudgetEditComponent: {
          component: BudgetEditComponent,
          guards: [AuthGuard],
        },
      },
    }),
    BudgetFormModule,
    I18nModule,
    FakeTabsModule,
  ],
  declarations: [BudgetEditComponent],
  exports: [BudgetEditComponent],
  entryComponents: [BudgetEditComponent],
})
export class BudgetEditModule {}
