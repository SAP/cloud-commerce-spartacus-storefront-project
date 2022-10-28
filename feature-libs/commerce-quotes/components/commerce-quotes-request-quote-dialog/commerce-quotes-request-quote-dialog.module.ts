import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import {
  FormErrorsModule,
  IconModule,
  KeyboardFocusModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { CommerceQuotesRequestQuoteDialogComponent } from './commerce-quotes-request-quote-dialog.component';
import { defaultCommerceQuotesRequestQuoteDialogConfig } from './default-commerce-quotes-request-quote-dialog-config';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    UrlModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    RouterModule,
    KeyboardFocusModule,
    SpinnerModule,
  ],
  providers: [
    provideDefaultConfig(defaultCommerceQuotesRequestQuoteDialogConfig),
  ],
  declarations: [CommerceQuotesRequestQuoteDialogComponent],
  exports: [CommerceQuotesRequestQuoteDialogComponent],
})
export class CommerceQuotesRequestQuoteDialogModule {}
