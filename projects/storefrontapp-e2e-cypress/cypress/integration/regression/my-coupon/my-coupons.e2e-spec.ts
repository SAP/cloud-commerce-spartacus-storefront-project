import * as myCoupons from '../../../helpers/my-coupons';

describe('My coupons test for anonymous user', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
  });

  it('enter my coupons using anonymous user', () => {
    myCoupons.verifyMyCouponsAsAnonymous();
  });

  describe('claim coupon test for anonymous user', () => {
    beforeEach(() => {
      cy.window().then(win => win.sessionStorage.clear());
      cy.reload();
      myCoupons.registerUser();
    });
    it('claim customer coupon successfully for anonymous user', () => {
      myCoupons.verifyClaimCouponSuccessAsAnonymous(myCoupons.validCouponCode);
    });

    it('claim customer coupon failed for anonymous user', () => {
      myCoupons.verifyClaimCouponFailedAsAnonymous(myCoupons.invalidCouponCode);
    }); 
  });
});

describe('My coupons test for login user', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.requireLoggedIn();
    //cy.reload();
    cy.visit('/');
    cy.selectUserMenuOption({
      option: 'My Coupons',
    });
  });

  it('claim customer coupon, switch notification button and find product', () => {
    myCoupons.verifyMyCoupons();
  }); 
  
});

describe('My coupons test for pagination and sort', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.login(myCoupons.testUser, myCoupons.testPassword);
    //cy.reload();
    cy.visit('/');
    cy.selectUserMenuOption({
      option: 'My Coupons',
    });
  });

  it('should page and sort my coupon list', () => {
    myCoupons.verifyPagingAndSorting();
  }); 
});
