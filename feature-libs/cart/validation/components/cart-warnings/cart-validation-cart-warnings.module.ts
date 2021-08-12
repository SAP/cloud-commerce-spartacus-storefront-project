import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { CartValidationCartWarningsComponent } from './cart-validation-cart-warnings.component';

@NgModule({
  imports: [CommonModule, RouterModule, I18nModule, UrlModule],
  exports: [CartValidationCartWarningsComponent],
  declarations: [CartValidationCartWarningsComponent],
})
export class CartValidationCartWarningsModule {}
