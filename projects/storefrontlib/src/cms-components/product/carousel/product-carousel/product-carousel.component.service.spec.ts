import { TestBed } from '@angular/core/testing';
import {
  CmsProductCarouselComponent,
  Product,
  ProductService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';
import { ProductCarouselService } from './product-carousel.component.service';

const title = 'mockTitle';

const mockProduct: Product = {
  code: '111111',
  name: 'Camera',
  price: {
    formattedValue: '$100.00',
  },
};

class MockProductService {
  get(): Observable<Product> {
    return of(mockProduct);
  }
}

const productCodeArray: string[] = ['111111', '222222', '333333', '444444'];

const mockComponentData: CmsProductCarouselComponent = {
  uid: 'MockProductCarouselComponent',
  typeCode: 'ProductCarouselComponent',
  title: 'mockTitle',
  productCodes: productCodeArray.join(' '),
};

const MockCmsComponentData = <CmsComponentData<any>>{
  data$: of(mockComponentData),
};

describe('ProductCarouselService', () => {
  let productCarouselService: ProductCarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CmsComponentData,
          useValue: MockCmsComponentData,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        ProductCarouselService,
      ],
    });

    productCarouselService = TestBed.get(ProductCarouselService);
  });

  it('should inject ProductCarouselService', () => {
    expect(productCarouselService).toBeTruthy();
  });

  it('should have title', () => {
    spyOn(productCarouselService, 'fetchTitle').and.callThrough();
    spyOn(productCarouselService, 'getTitle').and.callThrough();

    let title$: string;

    productCarouselService.fetchTitle();
    productCarouselService
      .getTitle()
      .subscribe(data => (title$ = data))
      .unsubscribe();

    expect(title$).toBe(title);
  });

  it('should have products', () => {
    spyOn(productCarouselService, 'fetchItems').and.callThrough();
    spyOn(productCarouselService, 'getItems').and.callThrough();

    let products$: Observable<Product>[];

    productCarouselService.fetchItems();
    productCarouselService
      .getItems()
      .subscribe(data => (products$ = data))
      .unsubscribe();

    expect(products$.length).toBe(productCodeArray.length);
  });
});
