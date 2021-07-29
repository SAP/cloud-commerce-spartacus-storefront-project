import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { UserAuthModule } from './user-auth/user-auth.module';

@NgModule({
  // ClientAuthModule should always be imported after UserAuthModule to make sure client token expirations are correctly handled.
  imports: [CommonModule, UserAuthModule.forRoot(), ClientAuthModule.forRoot()],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
    };
  }
}
