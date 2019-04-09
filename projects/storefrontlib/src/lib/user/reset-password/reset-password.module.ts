import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfigModule, CmsConfig, I18nModule } from '@spartacus/core';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ResetPasswordComponent: { selector: 'cx-reset-password-form' },
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    I18nModule,
  ],
  declarations: [ResetPasswordFormComponent],
  exports: [ResetPasswordFormComponent],
  entryComponents: [ResetPasswordFormComponent],
})
export class ResetPasswordModule {}
