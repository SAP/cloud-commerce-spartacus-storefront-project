import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { of, Observable } from 'rxjs';

import { CartDataService, CartService } from '@spartacus/core';
import { SpinnerModule } from './../../ui/components/spinner/spinner.module';

import { AddToCartComponent } from './add-to-cart.component';

const productCode = '1234';
const mockCartEntry: any = [];
class MockCartService {
  addCartEntry(_productCode: string, _quantity: number): void {
    mockCartEntry.push({
      '1234': { entryNumber: 0, product: { code: productCode } }
    });
  }
  getEntry(_productCode: string): Observable<any> {
    return of();
  }
}

describe('AddToCartComponent', () => {
  let addToCartComponent: AddToCartComponent;
  let fixture: ComponentFixture<AddToCartComponent>;
  let service;
  let modalInstance;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SpinnerModule,
        NgbModule
      ],
      declarations: [AddToCartComponent],
      providers: [
        CartDataService,
        { provide: CartService, useClass: MockCartService },
        { provide: NgbModal, useValue: { open: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCartComponent);
    addToCartComponent = fixture.componentInstance;
    service = TestBed.get(CartService);
    addToCartComponent.productCode = productCode;
    modalInstance = TestBed.get(NgbModal);

    spyOn(modalInstance, 'open').and.returnValue({ componentInstance: {} });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(addToCartComponent).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    spyOn(service, 'getEntry').and.returnValue(of(mockCartEntry));
    addToCartComponent.ngOnInit();
    let result;
    addToCartComponent.cartEntry$.subscribe(entry => (result = entry));
    expect(result).toEqual(mockCartEntry);
  });

  it('should call addToCart()', () => {
    spyOn(service, 'addCartEntry').and.callThrough();

    addToCartComponent.addToCart();
    addToCartComponent.cartEntry$.subscribe();

    expect(modalInstance.open).toHaveBeenCalled();
    expect(service.addCartEntry).toHaveBeenCalledWith(productCode, 1);
  });

  // UI test will be added after replacing Material
});
