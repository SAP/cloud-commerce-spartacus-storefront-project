import * as quickOrder from '../../../../helpers/b2b/b2b-quick-order';
import { viewportContext } from '../../../../helpers/viewport-context';
import * as sampleData from '../../../../sample-data/b2b-checkout';
import * as alerts from '../../../../helpers/global-message';

context('B2B - Quick Order', () => {
  viewportContext(['mobile', 'desktop'], () => {
    beforeEach(() => {
      cy.window().then((win) => win.sessionStorage.clear());
      cy.window().then((win) => win.localStorage.clear());
      cy.clearLocalStorageMemory();
    });

    describe('Quick Order Page', () => {
      beforeEach(() => {
        quickOrder.visitQuickOrderPage();
      });

      it('should add product to the cart', () => {
        quickOrder.addProductToTheList(sampleData.b2bProduct.code);
        quickOrder.addToCart();
        quickOrder.verifyMiniCartQuantity(1);
        quickOrder.verifyQuickOrderListQuantity(0);
        alerts
          .getSuccessAlert()
          .should('contain', `Quick order list has been added to the cart`);
      });

      it('should add product to the list', () => {
        quickOrder.addProductToTheList(sampleData.b2bProduct.code);
        quickOrder.verifyQuickOrderListQuantity(1);
      });

      it('should add 2 different products to the list', () => {
        quickOrder.addManyProductsToTheList(sampleData.products);
        quickOrder.verifyQuickOrderListQuantity(2);
      });

      it('should remove first product on the list', () => {
        quickOrder.addManyProductsToTheList(sampleData.products);
        quickOrder.removeFirstRow();
        quickOrder.verifyQuickOrderListQuantity(1);
      });

      it('should clear the list', () => {
        quickOrder.addManyProductsToTheList(sampleData.products);
        quickOrder.clearList();
        quickOrder.verifyQuickOrderListQuantity(0);
        alerts
          .getAlert()
          .should('contain', `Quick order list has been cleared`);
      });

      it('should show message if product code is invalid', () => {
        const invalidProductCode = 'invalidCode';

        quickOrder.addWrongProductToTheList(invalidProductCode);
        alerts
          .getErrorAlert()
          .should(
            'contain',
            `Product with code '${invalidProductCode}' not found!`
          );
      });

      it('should limit the list and block form for adding more products', () => {
        quickOrder.addManyProductsToTheList(sampleData.b2bProducts);
        quickOrder.verifyQuickOrderFormIsDisabled();
      });

      it('should hide "Empty List" button if list has no entries', () => {
        quickOrder.verifyEmptyListButtonIsHidden();
      });
    });

    describe('Cart Page', () => {
      beforeEach(() => {
        quickOrder.prepareCartWithProduct();
      });

      it('should add product with quick form', () => {
        quickOrder.addProductToCartWithQuickForm(sampleData.b2bProduct2.code);
        quickOrder.verifyMiniCartQuantity(2);

        alerts
          .getSuccessAlert()
          .should(
            'contain',
            `${sampleData.b2bProduct2.name} has been added to the cart`
          );
      });

      it('should reach product maximum stock level while adding product with quick form', () => {
        quickOrder.addProductToCartWithQuickForm(
          sampleData.b2bProduct2.code,
          9999
        );
        quickOrder.addProductToCartWithQuickForm(
          sampleData.b2bProduct2.code,
          9999
        );

        alerts
          .getWarningAlert()
          .should('contain', `The maximum stock level has been reached`);
      });
    });

    describe('Accessibility - keyboarding', () => {
      it('should conform to tabbing order for quick order page', () => {
        quickOrder.visitQuickOrderPage();
        quickOrder.addProductToTheList(sampleData.b2bProduct.code);
        quickOrder.verifyQuickOrderPageTabbingOrder();
      });

      it('should conform to tabbing order for cart page', () => {
        quickOrder.prepareCartWithProduct();
        quickOrder.verifyCartPageTabbingOrder();
      });
    });
  });
});
