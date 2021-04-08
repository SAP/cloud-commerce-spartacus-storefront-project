import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { QuickOrderFormComponent } from './quick-order-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, I18nModule, FormErrorsModule],
  declarations: [QuickOrderFormComponent],
  exports: [QuickOrderFormComponent],
  entryComponents: [QuickOrderFormComponent],
})
export class QuickOrderFormModule {}
