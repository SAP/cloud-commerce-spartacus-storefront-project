import { TestBed } from '@angular/core/testing';
import { ADD_TO_CART_FEEDBACK, CartConfig } from '@spartacus/cart/base/root';
import { CartConfigService } from './cart-config.service';

describe('CartConfigService', () => {
  let mockCartConfig: CartConfig;
  let service: CartConfigService;

  beforeEach(() => {
    mockCartConfig = {};
    TestBed.configureTestingModule({
      providers: [{ provide: CartConfig, useValue: mockCartConfig }],
    });
    service = TestBed.inject(CartConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isSelectiveCartService', () => {
    it('should return true if selectiveCart enabled is set to true', () => {
      mockCartConfig.cart = {
        selectiveCart: { enabled: true },
        addToCartFeedback: {
          feedback: ADD_TO_CART_FEEDBACK.MODAL,
        },
      };
      expect(service.isSelectiveCartEnabled()).toBeTruthy();
    });

    it('should return false if selectiveCart enabled is set to false', () => {
      expect(service.isSelectiveCartEnabled()).toBeFalsy();
    });
  });

  describe('isCartValidationEnabled', () => {
    it('should return true if cart validation enabled is set to true', () => {
      mockCartConfig.cart = {
        validation: { enabled: true },
        addToCartFeedback: { feedback: ADD_TO_CART_FEEDBACK.MODAL },
      };
      expect(service.isCartValidationEnabled()).toBeTruthy();
    });

    it('should return false if cart validation enabled is set to false', () => {
      expect(service.isCartValidationEnabled()).toBeFalsy();
    });
  });
});
