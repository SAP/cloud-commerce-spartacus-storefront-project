import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  CartItemComponentOutlets,
  IconModule,
  provideOutlet,
} from '@spartacus/storefront';
import { ConfigureCartEntryModule } from '../configure-cart-entry/configure-cart-entry.module';
import { ConfiguratorIssuesNotificationComponent } from './configurator-issues-notification.component';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    IconModule,
    ConfigureCartEntryModule,
  ],
  declarations: [ConfiguratorIssuesNotificationComponent],
  providers: [
    provideOutlet({
      id: CartItemComponentOutlets.START,
      component: ConfiguratorIssuesNotificationComponent,
    }),
  ],
  exports: [ConfiguratorIssuesNotificationComponent],
})
export class ConfiguratorIssuesNotificationModule {}
