import { TestBed } from '@angular/core/testing';
import { OrderEntry, Product } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { QuickOrderAdapter } from '../connectors/quick-order.adapter';
import { QuickOrderService } from './quick-order.service';

const mockProduct1Code: string = 'mockCode1';
const mockProduct2Code: string = 'mockCode2';
const mockProduct1: Product = {
  code: mockProduct1Code,
  price: {
    value: 1,
  },
};
const mockProduct2: Product = {
  code: mockProduct2Code,
  price: {
    value: 1,
  },
};
const mockEntry1: OrderEntry = {
  product: mockProduct1,
  quantity: 1,
  basePrice: {
    value: 1,
  },
  totalPrice: {
    value: 1,
  },
};
const mockEntry2: OrderEntry = {
  product: mockProduct2,
  quantity: 2,
  basePrice: {
    value: 1,
  },
  totalPrice: {
    value: 1,
  },
};
const mockEntry1AfterUpdate: OrderEntry = {
  product: mockProduct1,
  quantity: 4,
  basePrice: {
    value: 1,
  },
  totalPrice: {
    value: 1,
  },
};
const mockEntries: OrderEntry[] = [mockEntry1, mockEntry2];

class MockQuickOrderAdapter implements Partial<QuickOrderAdapter> {
  search(_productCode: any): Observable<Product> {
    return of(mockProduct1);
  }
}

describe('QuickOrderService', () => {
  let service: QuickOrderService;
  let quickOrderAdapter: QuickOrderAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuickOrderService,
        { provide: QuickOrderAdapter, useClass: MockQuickOrderAdapter },
      ],
    });

    service = TestBed.inject(QuickOrderService);
    quickOrderAdapter = TestBed.inject(QuickOrderAdapter);
  });

  beforeEach(() => {
    service.clearList();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty list of entries', () => {
    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual([]);
    });
  });

  it('should load and return list of entries', () => {
    service.loadEntries(mockEntries);
    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual(mockEntries);
    });
  });

  it('should clear list of entries', () => {
    service.loadEntries(mockEntries);
    service.clearList();
    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual([]);
    });
  });

  it('should trigger search', () => {
    spyOn(quickOrderAdapter, 'search');

    service.search(mockProduct1Code);
    expect(quickOrderAdapter.search).toHaveBeenCalledWith(mockProduct1Code);
  });

  it('should update entry quantity', () => {
    service.loadEntries([mockEntry1]);
    service.updateEntryQuantity(0, 4);

    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual([mockEntry1AfterUpdate]);
    });
  });

  it('should remove entry', () => {
    service.loadEntries(mockEntries);
    service.removeEntry(0);

    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual([mockEntry2]);
    });
  });

  it('should add product to the quick order list', () => {
    service.addProduct(mockProduct1);

    service.getEntries().subscribe((entries) => {
      expect(entries).toEqual([
        {
          product: mockProduct1,
          quantity: 1,
          basePrice: {
            value: 1,
          },
          totalPrice: {
            value: 1,
          },
        },
      ]);
    });
  });
});
