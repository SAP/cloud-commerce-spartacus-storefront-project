import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import { CdcJsService } from '@spartacus/cdc/root';
import {
  AuthService,
  CmsConfig,
  CommandService,
  EventService,
  GlobalMessageService,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  FormErrorsModule,
  NgSelectA11yModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { RegisterComponentService } from '@spartacus/user/profile/components';
import { UserRegisterFacade } from '@spartacus/user/profile/root';
import { CDCRegisterComponentService } from './cdc-register-component.service';
import { CdcRegisterComponent } from './cdc-register.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    SpinnerModule,
    FormErrorsModule,
    NgSelectModule,
    NgSelectA11yModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        RegisterCustomerComponent: {
          component: CdcRegisterComponent,
          providers: [
            {
              provide: RegisterComponentService,
              useClass: CDCRegisterComponentService,
              deps: [
                UserRegisterFacade,
                CommandService,
                Store,
                CdcJsService,
                GlobalMessageService,
                AuthService,
                EventService,
              ],
            },
          ],
        },
      },
    }),
  ],
  declarations: [CdcRegisterComponent],
})
export class CDCRegisterModule {}
