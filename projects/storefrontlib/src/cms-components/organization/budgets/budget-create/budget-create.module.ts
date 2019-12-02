import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  CmsConfig,
  ConfigModule,
  CxDatePipe, I18nModule,
  UserService,
} from '@spartacus/core';
import { BudgetCreateComponent } from './budget-create.component';
import { BudgetFormModule } from '../budget-form/budget-form.module';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        BudgetCreateComponent: {
          component: BudgetCreateComponent,
          guards: [AuthGuard],
        },
      },
    }),
    BudgetFormModule,
    I18nModule,
  ],
  declarations: [BudgetCreateComponent],
  exports: [BudgetCreateComponent],
  providers: [UserService, CxDatePipe],
  entryComponents: [BudgetCreateComponent],
})
export class BudgetCreateModule {}
