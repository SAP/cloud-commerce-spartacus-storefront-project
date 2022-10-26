import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { AsmCustomerTableModule } from '../../asm-customer-ui-components/asm-customer-table/asm-customer-table.module';
import { AsmCustomerActivityComponent } from './asm-customer-activity.component';

@NgModule({
  imports: [CommonModule, AsmCustomerTableModule, I18nModule],
  declarations: [AsmCustomerActivityComponent],
  exports: [AsmCustomerActivityComponent],
})
export class AsmCustomerActivityModule {}
