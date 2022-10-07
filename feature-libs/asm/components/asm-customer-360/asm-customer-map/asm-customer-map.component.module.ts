import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';

import { AsmCustomerMapComponent } from './asm-customer-map.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [AsmCustomerMapComponent],
  exports: [AsmCustomerMapComponent],
})
export class AsmCustomerMapComponentModule {}
