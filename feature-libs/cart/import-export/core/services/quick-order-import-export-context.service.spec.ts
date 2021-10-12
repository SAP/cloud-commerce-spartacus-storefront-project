import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrderEntry, ProductAdapter } from '@spartacus/core';
import {
  ProductData,
  QuickOrderImportExportContext,
} from '@spartacus/cart/import-export/core';
import { QuickOrderFacade } from '@spartacus/cart/quick-order/root';
import createSpy = jasmine.createSpy;

const mockProductData: ProductData[] = [
  { productCode: '693923', quantity: 1 },
  { productCode: '232133', quantity: 2 },
];

const products = {
  693923: { name: 'mockProduct1', code: '693923' },
  232133: { name: 'mockProduct2', code: '232133' },
};

const mockEntries: OrderEntry[] = [
  {
    quantity: 1,
    product: products['693923'],
  },
  {
    quantity: 2,
    product: products['232133'],
  },
];

class MockProductAdapter implements Partial<ProductAdapter> {
  load = createSpy().and.callFake((code) => of(products[code]));
}

class MockQuickOrderFacade implements Partial<QuickOrderFacade> {
  addProduct = createSpy().and.callThrough();
  getEntries = createSpy().and.returnValue(of(mockEntries));
}

describe('QuickOrderImportExportContext', () => {
  let service: QuickOrderImportExportContext;
  let quickOrderFacade: QuickOrderFacade;
  let productAdapter: ProductAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { useClass: MockQuickOrderFacade, provide: QuickOrderFacade },
        { useClass: MockProductAdapter, provide: ProductAdapter },
      ],
    });
    service = TestBed.inject(QuickOrderImportExportContext);
    quickOrderFacade = TestBed.inject(QuickOrderFacade);
    productAdapter = TestBed.inject(ProductAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEntries', () => {
    it('getEntries from quick order', () => {
      let entries: OrderEntry[];
      service
        .getEntries()
        .subscribe((result) => {
          entries = result;
        })
        .unsubscribe();

      expect(quickOrderFacade.getEntries).toHaveBeenCalledWith();
      expect(entries).toEqual(mockEntries);
    });
  });

  describe('addEntries', () => {
    it('should add entries to quick order', () => {
      service.addEntries(mockProductData).subscribe();

      expect(productAdapter.load).toHaveBeenCalledTimes(mockProductData.length);
      expect(productAdapter.load).toHaveBeenCalledWith(
        mockProductData[0].productCode
      );
      expect(productAdapter.load).toHaveBeenCalledWith(
        mockProductData[1].productCode
      );
      expect(quickOrderFacade.addProduct).toHaveBeenCalledTimes(
        mockProductData.length
      );
      expect(quickOrderFacade.addProduct).toHaveBeenCalledWith(
        products['693923'],
        mockProductData[0].quantity
      );
      expect(quickOrderFacade.addProduct).toHaveBeenCalledWith(
        products['232133'],
        mockProductData[1].quantity
      );
    });
  });
});
