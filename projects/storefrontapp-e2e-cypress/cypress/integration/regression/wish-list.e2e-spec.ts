import * as wishlist from '../../helpers/wish-list';

describe('Wish list', () => {
  before(() => {
    cy.window().then(win => {
      win.localStorage.clear();
    });
  });

  describe('anonymous', () => {
    xit('should go to login and redirect to PDP', () => {
      wishlist.addToWishListAnonymous();
    });
  });

  describe('logged in', () => {
    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    it('should add to wish list', () => {
      wishlist.registerWishListUser();
      wishlist.loginWishListUser();
      wishlist.addToWishList(wishlist.products[0]);
      wishlist.verifyProductInWishListPdp();
      wishlist.verifyProductInWishList(wishlist.products[0]);
    });

    it('should remove product from wish list page', () => {
      wishlist.removeProductFromWishListPage(wishlist.products[0]);
    });

    it('should remove product from wish list from product details page', () => {
      wishlist.addToWishList(wishlist.products[0]);
      wishlist.removeProductFromPdp();
    });

    it('should add product to cart from wish list', () => {
      wishlist.addToWishList(wishlist.products[1]);
      wishlist.verifyProductInWishList(wishlist.products[1]);
      wishlist.addProductToCart(wishlist.products[1]);
    });

    it('should persist wish list between sessions', () => {
      wishlist.checkWishListPersisted(wishlist.products[1]);
    });
  });
});
