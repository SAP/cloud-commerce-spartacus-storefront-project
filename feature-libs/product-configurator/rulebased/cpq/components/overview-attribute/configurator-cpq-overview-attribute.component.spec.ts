import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  I18nTestingModule,
  ImageType,
  Product,
  ProductService,
} from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { Configurator } from '../../../../rulebased/core/model/index';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfiguratorCPQOverviewAttributeComponent } from './configurator-cpq-overview-attribute.component';
import { Component, Input } from '@angular/core';

const mockAttributeOverviewInput: Configurator.AttributeOverview = {
  attribute: 'testAttribute',
  value: 'testValue',
  productCode: 'testProductCode',
  type: Configurator.AttributeOverviewType.BUNDLE,
};

const mockProductImageUrl = 'testUrl';

const mockProduct: Product = {
  code: 'testCode',
  name: 'testName',
  images: {
    [ImageType.PRIMARY]: {
      product: {
        url: mockProductImageUrl,
      },
    },
  },
};

const noCommerceProduct = { images: {}, noLink: true };

const product$: BehaviorSubject<Product> = new BehaviorSubject(null);

class MockProductService {
  get = () => product$.asObservable();
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cx-configurator-price',
  template: '',
})
class MockConfiguratorPriceComponent {
  @Input() productPrice: number;
  @Input() quantity = 1;
}

describe('ConfiguratorCPQOverviewAttributeComponent', () => {
  let component: ConfiguratorCPQOverviewAttributeComponent;
  let fixture: ComponentFixture<ConfiguratorCPQOverviewAttributeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MediaModule, I18nTestingModule],
        declarations: [
          ConfiguratorCPQOverviewAttributeComponent,
          MockConfiguratorPriceComponent,
        ],
        providers: [{ provide: ProductService, useClass: MockProductService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ConfiguratorCPQOverviewAttributeComponent
    );
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    component.attributeOverview = mockAttributeOverviewInput;
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('product', () => {
    it('should use dummy product if no product code exists', (done: DoneFn) => {
      product$.next(null);

      fixture.detectChanges();

      component.product$.pipe(take(1)).subscribe((product: Product) => {
        expect(product).toEqual(noCommerceProduct);

        done();
      });
    });

    it('should exist with product code', (done: DoneFn) => {
      product$.next(mockProduct);

      fixture.detectChanges();

      component.product$.pipe(take(1)).subscribe((product: Product) => {
        expect(product).toEqual(mockProduct);

        done();
      });
    });
  });

  describe('getProductPrimaryImage()', () => {
    it('should return primary image', () => {
      const image = component.getProductPrimaryImage(mockProduct);

      expect(image).toEqual(mockProduct.images[ImageType.PRIMARY]);
    });

    it('should not return image if no primary image', () => {
      const noImageProduct: Product = { ...mockProduct, images: {} };

      const image = component.getProductPrimaryImage(noImageProduct);

      expect(image).toBeFalsy();
    });
  });

  describe('UI', () => {
    const getProductImage = () =>
      fixture.debugElement.queryAll(By.css('.cx-thumbnail img'))[0];

    describe('product image', () => {
      it('should be visible if primary', () => {
        product$.next(mockProduct);

        fixture.detectChanges();

        expect(getProductImage().attributes['src']).toEqual(
          mockProductImageUrl
        );
      });

      it('should not be visible if not existing or not primary', () => {
        product$.next(null);

        fixture.detectChanges();

        expect(getProductImage()).toBeUndefined();
      });
    });
  });
});
