import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListPageLayoutComponent } from './product-list-page-layout.component';
import { ProductListModule } from '../../../product/components/product-list/product-list.module';
import { StoreModule, combineReducers } from '@ngrx/store';

import * as fromRoot from '../../../routing/store';
import * as fromProduct from '../../../product/store';
import * as fromCart from '../../../cart/store';
import * as fromUser from '../../../user/store';
import { BreadcrumbComponent } from './../../../cms-lib/breadcrumb/breadcrumb.component';
import { CmsModuleConfig } from '../../../cms/cms-module-config';
class UseCmsModuleConfig {
  cmsComponentMapping = {
    CMSLinkComponent: 'LinkComponent'
  };
}
describe('ProductListPageComponent', () => {
  let component: ProductListPageLayoutComponent;
  let fixture: ComponentFixture<ProductListPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ProductListModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          products: combineReducers(fromProduct.getReducers()),
          cart: combineReducers(fromCart.getReducers()),
          user: combineReducers(fromUser.getReducers())
        }),
        RouterTestingModule
      ],
      providers: [{ provide: CmsModuleConfig, useClass: UseCmsModuleConfig }],
      declarations: [ProductListPageLayoutComponent, BreadcrumbComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
