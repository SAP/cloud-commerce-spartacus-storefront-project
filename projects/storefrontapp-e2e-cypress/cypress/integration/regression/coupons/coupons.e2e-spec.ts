import * as cartCoupon from '../../../helpers/coupons/cart-coupon';
import { viewportContext } from '../../../helpers/viewport-context';

describe('Cart Coupon', () => {
  viewportContext(['mobile', 'desktop'], () => {
    beforeEach(() => {
      cy.window().then((win) => win.sessionStorage.clear());
      cy.requireLoggedIn();
    });
    it('should show error message when applied a wrong coupon', () => {
      cartCoupon.visitProductPage(cartCoupon.productCode1);
      cartCoupon.addProductToCart(cartCoupon.productCode1);
      cartCoupon.applyWrongCoupon();
    });

    it('should apply product category coupon', () => {
      const stateAuth = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
      cartCoupon.visitProductPage(cartCoupon.productCode2);
      cartCoupon.addProductToCart(cartCoupon.productCode2);
      cartCoupon.applyCoupon(cartCoupon.couponForProduct);
      cartCoupon.goTroughCheckout(stateAuth.token).then(() => {
        cartCoupon.verifyCouponInReviewOrder(cartCoupon.couponForProduct);
      });
    });

    it('should apply gift product coupon', () => {
      const stateAuth = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
      cartCoupon.visitProductPage(cartCoupon.productCode3);
      cartCoupon.addProductToCart(cartCoupon.productCode3);
      cartCoupon.applyCoupon(cartCoupon.freeGiftCoupon);
      cartCoupon.verifyGiftProductCoupon(cartCoupon.giftProductCode);
      cartCoupon.goTroughCheckout(stateAuth.token).then(() => {
        cartCoupon.verifyCouponInReviewOrder(cartCoupon.freeGiftCoupon);
      });
    });

    it('should be able to remove coupon and place order without it', () => {
      const stateAuth = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
      cartCoupon.visitProductPage(cartCoupon.productCode1);
      cartCoupon.addProductToCart(cartCoupon.productCode1);
      cartCoupon.applyCoupon(cartCoupon.couponForCart);
      cartCoupon.removeCoupon(cartCoupon.couponForCart);

      cartCoupon.goTroughCheckout(stateAuth.token).then(() => {
        cartCoupon.verifyCouponInReviewOrder();
      });
    });
  });
});
