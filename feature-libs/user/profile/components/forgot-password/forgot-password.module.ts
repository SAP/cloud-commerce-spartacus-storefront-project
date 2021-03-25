import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AuthConfigService,
  CmsConfig,
  GlobalMessageService,
  I18nModule,
  NotAuthGuard,
  provideDefaultConfig,
  RoutingService,
  UrlModule,
} from '@spartacus/core';
import { FormErrorsModule, SpinnerModule } from '@spartacus/storefront';
import { UserPasswordFacade } from '@spartacus/user/profile/root';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordService } from './forgot-password.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
    SpinnerModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ForgotPasswordComponent: {
          component: ForgotPasswordComponent,
          guards: [NotAuthGuard],
          providers: [
            {
              provide: ForgotPasswordService,
              useClass: ForgotPasswordService,
              deps: [
                UserPasswordFacade,
                RoutingService,
                AuthConfigService,
                GlobalMessageService,
              ],
            },
          ],
        },
      },
    }),
  ],
  declarations: [ForgotPasswordComponent],
})
export class ForgotPasswordModule {}
