import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { ProfileTagComponent } from '../cms-components/profile-tag/profile-tag.component';

@NgModule({
  imports: [
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProfileTagComponent: {
          component: ProfileTagComponent,
        },
      },
    }),
    CommonModule,
  ],
  exports: [ProfileTagComponent],
  declarations: [ProfileTagComponent],
  entryComponents: [ProfileTagComponent],
})
export class ProfileTagModule {}
