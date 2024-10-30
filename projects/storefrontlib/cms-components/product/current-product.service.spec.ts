import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Product,
  ProductScope,
  ProductService,
  RoutingService,
} from '@spartacus/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CurrentProductService } from './current-product.service';

const mockRouterState = {
  state: {
    params: { productCode: '123456' },
  },
};

const mockRouter$ = new BehaviorSubject<{ state: object }>(mockRouterState);

class MockRoutingService {
  getRouterState() {
    return mockRouter$.asObservable();
  }
}

const mockProduct: Product = { name: 'mockProduct' };

const mockProductWithAttributes: Product = {
  ...mockProduct,
  classifications: [{}],
};

class MockProductService {
  get(_code: string, scope?: string): Observable<Product> {
    if (scope && scope === 'attributes') {
      return of(mockProductWithAttributes);
    }
    return of(mockProduct);
  }
  getRealTimeStock(_productCode: string) {
    return of('25'); // Mock response
  }
}

describe('CurrentProductService', () => {
  let currentProductService: CurrentProductService;
  let routingService: RoutingService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CurrentProductService,
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    });

    currentProductService = TestBed.inject(CurrentProductService);
    routingService = TestBed.inject(RoutingService);
    productService = TestBed.inject(ProductService);

    spyOn(routingService, 'getRouterState').and.callThrough();
    spyOn(productService, 'get').and.callThrough();
  });

  it('should emit product data', () => {
    let result: Product;

    currentProductService
      .getProduct()
      .subscribe((product) => (result = product))
      .unsubscribe();

    expect(result).toEqual(mockProduct);
  });

  it('should emit product with attributes', () => {
    let result: Product;
    currentProductService
      .getProduct(ProductScope.ATTRIBUTES)
      .subscribe((product) => (result = product))
      .unsubscribe();
    expect(result).toEqual(mockProductWithAttributes);
  });

  it('should return null if product code is not present on route', () => {
    const mockRouterEmptyProductCode = { state: { params: {} } };

    mockRouter$.next(mockRouterEmptyProductCode);

    let result: Product;
    currentProductService
      .getProduct()
      .subscribe((product) => (result = product))
      .unsubscribe();
    expect(result).toBe(null);
  });

  it('should emit real-time stock data for the given product code and unit', (done) => {
    const mockProductCode = '12345';
    const mockQuantity = '25';
    const mockstatus = 'inStock';
    const mockUnit = 'EA';

    const mockStockData = {
      quantity: mockQuantity,
      status: mockstatus,
    };

    spyOn(productService, 'getRealTimeStock').and.returnValue(
      of(mockStockData)
    );

    currentProductService
      .getRealTimeStock(mockProductCode, mockUnit)
      .subscribe(({ quantity, status }) => {
        expect(quantity).toBe(mockQuantity);
        expect(status).toBe(mockstatus);
        done();
      });
  });

  it('should not emit old product data and fetch NEW product data', () => {
    const mockRouterNewProductCode = {
      ...mockRouterState,
      state: { ...mockRouterState.state, params: { productCode: 'abc' } },
    };

    mockRouter$.next(mockRouterState);

    const sub: Subscription = currentProductService.getProduct().subscribe();

    expect(productService.get).toHaveBeenCalledWith(
      mockRouterState.state.params.productCode,
      ProductScope.DETAILS
    );

    mockRouter$.next(mockRouterNewProductCode);

    expect(productService.get).toHaveBeenCalledWith(
      mockRouterNewProductCode.state.params.productCode,
      ProductScope.DETAILS
    );

    sub.unsubscribe();
  });
});
