import { ProductVariantGuard } from '@spartacus/storefront';
import {
  Product,
  ProductService,
  RoutingService,
  CmsService,
} from '@spartacus/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Type } from '@angular/core';
import { Observable, of } from 'rxjs';

const mockPurchasableProduct = {
  name: 'purchasableProduct',
  productCode: 'purchasableTest123',
  purchasable: true,
};

const mockNonPurchasableProduct = {
  name: 'nonPurchasableProduct',
  productCode: 'purchasableTest123',
  purchasable: false,
  variantOptions: [
    {
      code: 'mock_code_3',
      stock: { stockLevel: 15 },
    },
    {
      code: 'mock_code_4',
      stock: { stockLevel: 0 },
    },
  ],
};

class MockRoutingService {
  getRouterState(): Observable<any> {
    return of({
      nextState: {
        params: {
          productCode: 'test123',
        },
      },
    });
  }
  go() {
    return of();
  }
}

class MockProductService {
  get(): Observable<Product> {
    return of();
  }
}

class MockCmsService {
  isLaunchInSmartEdit(): boolean {
    return false;
  }
}

describe('ProductVariantGuard', () => {
  let guard: ProductVariantGuard;
  let productService: ProductService;
  let routingService: RoutingService;
  let cmsService: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        { provide: CmsService, useClass: MockCmsService },
      ],
      imports: [RouterTestingModule],
    });

    guard = TestBed.get(ProductVariantGuard as Type<ProductVariantGuard>);
    productService = TestBed.get(ProductService as Type<ProductService>);
    routingService = TestBed.get(RoutingService as Type<RoutingService>);
    cmsService = TestBed.get(CmsService as Type<CmsService>);
  });

  it('should return true if product is purchasable', done => {
    spyOn(productService, 'get').and.returnValue(of(mockPurchasableProduct));

    guard.canActivate().subscribe(val => {
      expect(val).toBeTruthy();
      done();
    });
  });

  it('should return false and redirect if product is non-purchasable', done => {
    spyOn(productService, 'get').and.returnValue(of(mockNonPurchasableProduct));
    spyOn(routingService, 'go').and.stub();

    guard.canActivate().subscribe(val => {
      expect(val).toBeFalsy();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'product',
        params: mockNonPurchasableProduct,
      });
      done();
    });
  });

  it('should return true if launch from smartedit and no productCode in route parameter', done => {
    spyOn(routingService, 'getRouterState').and.returnValue(
      of({
        nextState: {
          params: {},
        },
      } as any)
    );

    spyOn(cmsService, 'isLaunchInSmartEdit').and.returnValue(true);

    guard.canActivate().subscribe(val => {
      expect(val).toBeTruthy();
      done();
    });
  });
});
