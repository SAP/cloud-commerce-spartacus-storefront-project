import { ComponentsModule } from './../../../../ui/components/components.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { ComponentMapperService } from '../../../../cms/services/component-mapper.service';

import * as fromCart from '../../../../cart/store';
import * as fromRoot from '../../../../routing/store';
import * as fromUser from '../../../../user/store';
import * as fromProduct from '../../../store/reducers';
import {
  NgbTabsetModule,
  NgbAccordionModule,
  NgbTabsetConfig,
  NgbAccordionConfig,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
// guards

import { ProductDetailsComponent } from './product-details.component';

class MockComponentMapperService {}
describe('ProductDetailsComponent in product', () => {
  let store: Store<fromProduct.ProductsState>;
  let productDetailsComponent: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProduct = 'mockProduct';
  const mockCartEntry = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          products: combineReducers(fromProduct.getReducers()),
          cart: combineReducers(fromCart.getReducers()),
          user: combineReducers(fromUser.getReducers())
        }),
        ComponentsModule,
        NgbTabsetModule,
        NgbAccordionModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProductDetailsComponent],
      providers: [
        NgbTabsetConfig,
        NgbAccordionConfig,
        {
          provide: ComponentMapperService,
          useClass: MockComponentMapperService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    fixture.detectChanges();
    productDetailsComponent = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
    spyOn(store, 'select').and.returnValues(of(mockProduct), of(mockCartEntry));
  });

  it('should be created', () => {
    expect(productDetailsComponent).toBeTruthy();
  });

  it('should call ngOnChanges()', () => {
    productDetailsComponent.productCode = '123456';
    productDetailsComponent.ngOnChanges();
    productDetailsComponent.product$.subscribe(product =>
      expect(product).toEqual(mockProduct)
    );
  });

  it('should go to reviews tab', () => {
    productDetailsComponent.productCode = '123456';
    productDetailsComponent.ngOnChanges();
    productDetailsComponent.product$.subscribe(product => {
      fixture.detectChanges();
      productDetailsComponent.goToReviews();
      expect(productDetailsComponent.tabSet.activeId).toEqual('reviews');
    });
  });
});
