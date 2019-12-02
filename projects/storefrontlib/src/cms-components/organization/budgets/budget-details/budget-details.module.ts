import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  CxDatePipe,
  I18nModule,
  UrlModule,
  UserService,
} from '@spartacus/core';
import { ListNavigationModule } from '../../../../shared/components/list-navigation/list-navigation.module';
import { BudgetDetailsComponent } from './budget-details.component';
import { RouterModule } from '@angular/router';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { suffixUrlMatcher } from '../../../../cms-structure/routing/suffix-routes/suffix-url-matcher';
import { TableModule } from '../../../../shared/components/table/table.module';
// import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
// import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'budgetDetails' },
      },
      {
        matcher: suffixUrlMatcher,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: {
          cxSuffixUrlMatcher: {
            paramName: 'budgetCode',
          },
        },
      },
    ]),
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        BudgetDetailsComponent: {
          component: BudgetDetailsComponent,
          guards: [AuthGuard],
        },
      },
    }),
    FormsModule,
    NgSelectModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    TableModule,
  ],
  declarations: [BudgetDetailsComponent],
  exports: [BudgetDetailsComponent],
  providers: [UserService, CxDatePipe],
  entryComponents: [BudgetDetailsComponent],
})
export class BudgetDetailsModule {}
