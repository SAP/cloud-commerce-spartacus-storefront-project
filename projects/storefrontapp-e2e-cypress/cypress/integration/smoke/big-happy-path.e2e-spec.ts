import * as bigHappyPath from '../../helpers/big-happy-path';

context('Big happy path', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.visit('/');
  });

  it('should register successfully', () => {
    bigHappyPath.signInAndRegister();
    bigHappyPath.verifyUser();
  });

  it('should go to product page from category page', () => {
    bigHappyPath.changePage();
  });

  it('should add product to cart and go to checkout', () => {
    bigHappyPath.addProductToCart();
  });

  it('should fill in address form', () => {
    bigHappyPath.fillAddressForm();
  });

  it('should choose delivery', () => {
    bigHappyPath.chooseDeliveryMethod();
  });

  it('should fill in payment form', () => {
    bigHappyPath.fillPaymentForm();
  });

  it('should review and place order', () => {
    bigHappyPath.placeOrder();
  });

  it('should display summary page', () => {
    bigHappyPath.displaySummaryPage();
  });

  it('should be able to check order in order history', () => {
    bigHappyPath.viewOrderHistory();
    bigHappyPath.signOut();
  });
});
