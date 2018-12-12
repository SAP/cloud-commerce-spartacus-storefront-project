import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';

import { CartService } from '../../cart/facade/cart.service';
import { CmsService } from '../../cms/facade/cms.service';

import { MiniCartComponent } from './mini-cart.component';
import { Cart, OrderEntry, CmsComponent } from '@spartacus/core';

const testCart: Cart = {
  code: 'xxx',
  guid: 'xxx',
  totalItems: 0,
  deliveryItemsQuantity: 1,
  totalPrice: {
    currencyIso: 'USD',
    value: 10.0
  },
  totalPriceWithTax: {
    currencyIso: 'USD',
    value: 10.0
  }
};

const orderEntry: OrderEntry = {
  entryNumber: 0,
  product: { code: '1234' }
};

const testEntries: { [id: string]: OrderEntry }[] = [{ '1234': orderEntry }];

const mockComponentData: any = {
  uid: '001',
  typeCode: 'MiniCartComponent',
  modifiedTime: '2017-12-21T18:15:15+0000',
  shownProductCount: '3',
  lightboxBannerComponent: {
    uid: 'banner',
    typeCode: 'SimpleBannerComponent'
  }
};

class MockCmsService {
  getComponentData<T extends CmsComponent>(): Observable<T> {
    return of(mockComponentData);
  }
}

class MockCartService {
  cart$ = of(testCart);
  entries$ = of(testEntries);
}

describe('MiniCartComponent', () => {
  let miniCartComponent: MiniCartComponent;
  let fixture: ComponentFixture<MiniCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MiniCartComponent],
      providers: [
        { provide: CmsService, useClass: MockCmsService },
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCartComponent);
    miniCartComponent = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(miniCartComponent).toBeTruthy();
  });

  it('should contain cms content in the html rendering after bootstrap', () => {
    expect(miniCartComponent.component).toBeNull();
    miniCartComponent.onCmsComponentInit(mockComponentData.uid);
    expect(miniCartComponent.component).toBe(mockComponentData);

    expect(miniCartComponent.banner).toBe(
      mockComponentData.lightboxBannerComponent
    );
    expect(miniCartComponent.showProductCount).toEqual(
      +mockComponentData.shownProductCount
    );
  });

  describe('UI test', () => {
    it('should contain a link to redirect to /cart', () => {
      expect(fixture.debugElement.query(By.css('button[routerLink="/cart"]')));
    });
  });
});
