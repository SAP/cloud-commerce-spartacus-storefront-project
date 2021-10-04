import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { ConfiguratorExitButtonComponent } from './configurator-exit-button.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ConfiguratorExitButton: {
          component: ConfiguratorExitButtonComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorExitButtonComponent],
  exports: [ConfiguratorExitButtonComponent],
})
export class ConfiguratorExitButtonModule {}
