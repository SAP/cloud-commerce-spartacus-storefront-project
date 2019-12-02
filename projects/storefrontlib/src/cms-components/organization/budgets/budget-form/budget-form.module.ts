import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule, CxDatePipe,
  I18nModule,
  UrlModule,
  UserService,
} from '@spartacus/core';
import { ListNavigationModule } from '../../../../shared/components/list-navigation/list-navigation.module';
import { BudgetFormComponent } from './budget-form.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        BudgetFormComponent: {
          component: BudgetFormComponent,
          guards: [AuthGuard],
        },
      },
    }),
    RouterModule,
    FormsModule,
    NgSelectModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
  ],
  declarations: [BudgetFormComponent],
  exports: [BudgetFormComponent],
  providers: [UserService, CxDatePipe],
  entryComponents: [BudgetFormComponent],
})
export class BudgetFormModule {}
