import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TogglePasswordVisibilityDirective } from './toggle-password-visibility.directive';
import { TogglePasswordVisibilityComponent } from './toggle-password-visibility.component';
import { IconModule } from '../../../../cms-components/misc/icon/icon.module';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import { FormConfig } from '../../../../shared/config/form-config';
import { defaultFormConfig } from '../../../../shared/config/default-form-config';

@NgModule({
  imports: [CommonModule, IconModule, I18nModule],
  providers: [provideDefaultConfig(<FormConfig>defaultFormConfig)],
  declarations: [
    TogglePasswordVisibilityDirective,
    TogglePasswordVisibilityComponent,
  ],
  exports: [
    TogglePasswordVisibilityDirective,
    TogglePasswordVisibilityComponent,
  ],
})
export class TogglePasswordVisibilityModule {}
