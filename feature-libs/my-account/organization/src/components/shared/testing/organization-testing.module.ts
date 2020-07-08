import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, UrlTestingModule } from '@spartacus/core';
import {
  IconTestingModule,
  PaginationTestingModule,
  SplitViewTestingModule,
  TableModule,
} from '@spartacus/storefront';

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    I18nTestingModule,
    UrlTestingModule,
    SplitViewTestingModule,
    TableModule,
    PaginationTestingModule,
    IconTestingModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    RouterTestingModule,
    I18nTestingModule,
    UrlTestingModule,
    SplitViewTestingModule,
    TableModule,
    PaginationTestingModule,
    IconTestingModule,
  ],
})
export class OrganizationTestingModule {}
