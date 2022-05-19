import { NgModule } from '@angular/core';
import { UserRegistrationComponentsModule } from '@spartacus/organization/user-registration/components';
import { UserRegistrationCoreModule } from '@spartacus/organization/user-registration/core';
import { UserRegistrationOccModule } from '@spartacus/organization/user-registration/occ';

@NgModule({
  imports: [
    UserRegistrationCoreModule.forRoot(),
    UserRegistrationComponentsModule,
    UserRegistrationOccModule,
  ],
})
export class OrganizationUserRegistrationModule {}
