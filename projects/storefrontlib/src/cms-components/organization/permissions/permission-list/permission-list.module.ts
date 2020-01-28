import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { PermissionsListComponent } from './permissions-list.component';
import { TableModule } from '../../../../shared/components/table/table.module';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ManagePermissionsListComponent: {
          component: PermissionsListComponent,
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
    TableModule,
    ReactiveFormsModule,
  ],
  declarations: [PermissionsListComponent],
  exports: [PermissionsListComponent],
  providers: [UserService, CxDatePipe],
  entryComponents: [PermissionsListComponent],
})
export class PermissionsListModule {}
