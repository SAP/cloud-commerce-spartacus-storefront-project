import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CmsPageGuards } from '../../../cms/guards/cms-page.guard';

import { CategoryPageComponent } from './category-page.component';
import { PageLayoutModule } from '../../../cms/page-layout/page-layout.module';
import { ProductListModule } from '../../../product/components/product-list/product-list.module';
import { OutletRefModule } from '../../../outlet/outlet-ref/outlet-ref.module';

const routes: Routes = [
  {
    path: null,
    canActivate: [CmsPageGuards],
    component: CategoryPageComponent,
    data: { pageLabel: 'search', cxPath: 'search' }
  },
  {
    path: null,
    canActivate: [CmsPageGuards],
    component: CategoryPageComponent,
    data: { cxPath: 'category' }
  },
  {
    path: null,
    canActivate: [CmsPageGuards],
    component: CategoryPageComponent,
    data: { cxPath: 'brand' }
  },
  // redirect OLD links
  {
    path: 'Open-Catalogue/:title/c/:categoryCode',
    redirectTo: null,
    data: { cxRedirectTo: 'category' }
  },
  {
    path: 'Open-Catalogue/:category1/:title/c/:categoryCode',
    redirectTo: null,
    data: { cxRedirectTo: 'category' }
  },
  {
    path: 'Open-Catalogue/:category1/:category2/:title/c/:categoryCode',
    redirectTo: null,
    data: { cxRedirectTo: 'category' }
  },
  {
    path: 'OpenCatalogue/:category1/:category2/:title/c/:categoryCode',
    redirectTo: null,
    data: { cxRedirectTo: 'category' }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageLayoutModule,
    ProductListModule,
    OutletRefModule
  ],
  declarations: [CategoryPageComponent]
})
export class CategoryPageModule {}
