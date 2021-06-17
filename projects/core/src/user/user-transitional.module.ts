import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserEventBuilder } from './events/user-event.builder';
import { UserEventModule } from './events/user-event.module';
import { UserStoreTransitionalModule } from './store/user-store-transitional.module';

@NgModule({
  imports: [UserStoreTransitionalModule, UserEventModule],
  providers: [UserEventBuilder],
})
export class UserTransitionalModule {
  static forRoot(): ModuleWithProviders<UserTransitionalModule> {
    return {
      ngModule: UserTransitionalModule,
    };
  }
}
