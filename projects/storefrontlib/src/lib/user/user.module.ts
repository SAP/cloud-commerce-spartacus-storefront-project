import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';

import { LoginModule } from './login/login.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserModule, UrlTranslationModule } from '@spartacus/core';
import { RegisterComponentModule } from './register/register.module';
import { LoginFormModule } from './login-form/login-form.module';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    LoginFormModule,
    ReactiveFormsModule,
    RouterModule,
    UserModule,
    UrlTranslationModule,
    RegisterComponentModule
  ],
  declarations: [ResetPasswordComponent],
  exports: [ResetPasswordComponent]
})
export class UserComponentModule {}
