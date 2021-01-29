import {
  Component,
  DebugElement,
  Directive,
  Input,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ControlContainer,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FeaturesConfigModule,
  I18nTestingModule,
  PromotionLocation,
} from '@spartacus/core';
import { ModalDirective } from 'projects/storefrontlib/src/shared/components/modal/modal.directive';
import { PromotionService } from '../../../../shared/services/promotion/promotion.service';
import { MockFeatureLevelDirective } from '../../../../shared/test/mock-feature-level-directive';
import { CartItemComponent } from './cart-item.component';
import {
  CartItemContext,
  CartItemContextSource,
} from './model/cart-item.context';

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

@Directive({
  selector: '[cxModal]',
})
class MockModalDirective implements Partial<ModalDirective> {
  @Input() cxModal;
}

@Component({
  template: '',
  selector: 'cx-media',
})
class MockMediaComponent {
  @Input() container;
  @Input() format;
}

@Component({
  template: '',
  selector: 'cx-item-counter',
})
class MockItemCounterComponent {
  @Input() control;
  @Input() readonly;
  @Input() max;
  @Input() allowZero;
}

@Component({
  template: '',
  selector: 'cx-promotions',
})
class MockPromotionsComponent {
  @Input() promotions;
}

const mockProduct = {
  baseOptions: [
    {
      selected: {
        variantOptionQualifiers: [
          {
            name: 'Size',
            value: 'XL',
          },
          {
            name: 'Style',
            value: 'Red',
          },
        ],
      },
    },
  ],
  stock: {
    stockLevelStatus: 'outOfStock',
  },
};

class MockPromotionService {
  getOrderPromotions(): void {}
  getOrderPromotionsFromCart(): void {}
  getOrderPromotionsFromCheckout(): void {}
  getOrderPromotionsFromOrder(): void {}
  getProductPromotionForEntry(): void {}
}

describe('CartItemComponent', () => {
  let cartItemComponent: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  let el: DebugElement;

  const featureConfig = jasmine.createSpyObj('FeatureConfigService', [
    'isEnabled',
    'isLevel',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          I18nTestingModule,
          FeaturesConfigModule,
        ],
        declarations: [
          CartItemComponent,
          MockMediaComponent,
          MockItemCounterComponent,
          MockPromotionsComponent,
          MockUrlPipe,
          MockFeatureLevelDirective,
          MockModalDirective,
        ],
        providers: [
          {
            provide: ControlContainer,
          },
          {
            provide: PromotionService,
            useClass: MockPromotionService,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemComponent);
    cartItemComponent = fixture.componentInstance;
    cartItemComponent.item = {
      product: mockProduct,
      updateable: true,
    };
    cartItemComponent.quantityControl = new FormControl('1');
    cartItemComponent.quantityControl.markAsPristine();
    spyOn(cartItemComponent, 'removeItem').and.callThrough();
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create CartItemComponent', () => {
    expect(cartItemComponent).toBeTruthy();
  });

  it('should provide locally CartItemContextSource', () => {
    expect(TestBed.inject(CartItemContextSource)).toBeTruthy();
  });

  it('should provide locally CartItemContext', () => {
    expect(TestBed.inject(CartItemContext)).toBe(
      TestBed.inject(CartItemContextSource)
    );
  });

  describe('after onChanges fired', () => {
    let cartItemContextSource: CartItemContextSource;

    beforeEach(() => {
      cartItemContextSource = TestBed.inject(CartItemContextSource);
    });

    it('should push "compact" to context', () => {
      spyOn(cartItemContextSource._compact$, 'next');
      cartItemComponent.compact = true;
      cartItemComponent.ngOnChanges();
      expect(cartItemContextSource._compact$.next).toHaveBeenCalledWith(
        cartItemComponent.compact
      );
    });

    it('should push "readonly" to context', () => {
      spyOn(cartItemContextSource._readonly$, 'next');
      cartItemComponent.readonly = true;
      cartItemComponent.ngOnChanges();
      expect(cartItemContextSource._readonly$.next).toHaveBeenCalledWith(
        cartItemComponent.readonly
      );
    });

    it('should push "item" to context', () => {
      spyOn(cartItemContextSource._item$, 'next');
      cartItemComponent.item = { orderCode: '123' };
      cartItemComponent.ngOnChanges();
      expect(cartItemContextSource._item$.next).toHaveBeenCalledWith(
        cartItemComponent.item
      );
    });

    it('should push "quantityControl" to context', () => {
      spyOn(cartItemContextSource._quantityControl$, 'next');
      cartItemComponent.quantityControl = new FormControl(2);
      cartItemComponent.ngOnChanges();
      expect(cartItemContextSource._quantityControl$.next).toHaveBeenCalledWith(
        cartItemComponent.quantityControl
      );
    });

    it('should push "promotionLocation" to context', () => {
      spyOn(cartItemContextSource._promotionLocation$, 'next');
      cartItemComponent.promotionLocation = PromotionLocation.Order;
      cartItemComponent.ngOnChanges();
      expect(
        cartItemContextSource._promotionLocation$.next
      ).toHaveBeenCalledWith(cartItemComponent.promotionLocation);
    });

    it('should push "options" to context', () => {
      spyOn(cartItemContextSource._options$, 'next');
      cartItemComponent.options = { isSaveForLater: true };
      cartItemComponent.ngOnChanges();
      expect(cartItemContextSource._options$.next).toHaveBeenCalledWith(
        cartItemComponent.options
      );
    });
  });

  it('should create cart details component', () => {
    featureConfig.isEnabled.and.returnValue(true);
    expect(cartItemComponent).toBeTruthy();

    fixture.detectChanges();

    featureConfig.isEnabled.and.returnValue(false);
    expect(cartItemComponent).toBeTruthy();
  });

  it('should call removeItem()', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(cartItemComponent.removeItem).toHaveBeenCalled();
    expect(cartItemComponent.quantityControl.value).toEqual(0);
  });

  it('should mark control "dirty" after removeItem is called', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(cartItemComponent.quantityControl.dirty).toEqual(true);
  });

  it('should call isProductOutOfStock()', () => {
    cartItemComponent.isProductOutOfStock(cartItemComponent.item.product);

    expect(cartItemComponent.item).toBeDefined();
    expect(cartItemComponent.item.product).toBeDefined();
    expect(cartItemComponent.item.product.stock).toBeDefined();

    expect(
      cartItemComponent.isProductOutOfStock(cartItemComponent.item.product)
    ).toBeTruthy();

    cartItemComponent.item.product.stock.stockLevelStatus = 'InStock';
    expect(
      cartItemComponent.isProductOutOfStock(cartItemComponent.item.product)
    ).toBeFalsy();
  });

  it('should display variant properties', () => {
    const variants =
      mockProduct.baseOptions[0].selected.variantOptionQualifiers;
    fixture.detectChanges();

    expect(el.queryAll(By.css('.cx-property')).length).toEqual(variants.length);
    variants.forEach((variant) => {
      const infoContainer: HTMLElement = el.query(By.css('.cx-info-container'))
        .nativeElement;
      expect(infoContainer.innerText).toContain(
        `${variant.name}: ${variant.value}`
      );
    });
  });
});
