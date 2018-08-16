import { browser, by, ExpectedConditions, promise } from 'protractor';

import { AddedToCartModal } from './cmslib/addedToCartModal.po';
import { ProductDetailsPage } from './pages/productDetails.po';
import { CartPage } from './pages/cart.po';
import { SearchResultsPage } from './pages/searchResults.po';
import { HomePage } from './pages/home.po';
import { E2EUtil } from './util.po';

const addFirstCameraToCart = (
  home: HomePage,
  searchResults: SearchResultsPage
) => {
  //   // search for camera
  home.header.performSearch('camera');
  // wait for search results page to show up
  browser.wait(ExpectedConditions.urlContains('/search/camera'));
  browser.wait(searchResults.getPage().isDisplayed());
  // select one product by name and add it to the cart
  searchResults
    .findProductByNameInResultsPage('Photosmart E317 Digital Camera')
    .then(product1 => {
      expect(product1.isDisplayed()).toBeTruthy();
      return product1;
    })
    .then(product1 => {
      searchResults.clickAddToCartButton4Product(product1);
      const atcModal: AddedToCartModal = new AddedToCartModal();
      atcModal.closeModalWait();
    });
  const minicartIcon = home.header.getMinicartIconComponent();
  browser
    .wait(ExpectedConditions.elementToBeClickable(minicartIcon))
    .then(() => {
      minicartIcon.click();
    });
};

describe('cart', () => {
  let home: HomePage;
  let searchResults: SearchResultsPage;
  let cart: CartPage;
  let productDetails: ProductDetailsPage;

  beforeEach(() => {
    home = new HomePage();
    searchResults = new SearchResultsPage();
    cart = new CartPage();
    productDetails = new ProductDetailsPage();
  });

  /**
   * Full interaction. Search 2 products, add to cart, then verify totals in cart.
   */
  it('should add products to cart', () => {
    // go to homepage
    home.navigateTo();

    // FIXME - add register and login steps

    //   // search for camera
    home.header.performSearch('camera');
    // wait for search results page to show up
    browser.wait(ExpectedConditions.urlContains('/search/camera'));
    browser.wait(searchResults.getPage().isDisplayed());
    // select one product by name and add it to the cart
    searchResults
      .findProductByNameInResultsPage('Photosmart E317 Digital Camera')
      .then(product1 => {
        expect(product1.isDisplayed()).toBeTruthy();
        return product1;
      })
      .then(product1 => {
        searchResults.clickAddToCartButton4Product(product1);
        // quantity should change
        const product1QuantitySpan = searchResults.getProductQuantitySpan(
          product1
        );
        E2EUtil.checkTextValue(
          product1QuantitySpan,
          '1',
          'Wrong add to cart button quantity in search results page'
        ).then(() => {
          const atcModal: AddedToCartModal = new AddedToCartModal();
          atcModal.closeModalWait();
        });
      });

    // search for specific product, but do not press enter
    home.header.performSearch('1934793', true);

    const overlay = E2EUtil.getOverlayContainer();
    E2EUtil.wait4VisibleElement(overlay);
    const autocompletePanel = E2EUtil.getComponentWithinParentByCss(
      overlay,
      `div[role="listbox"]`
    );
    E2EUtil.wait4VisibleElement(autocompletePanel);
    // select product from the suggestion list, then add it to cart 2 times
    const suggestionSpan = autocompletePanel
      .all(by.cssContainingText('.mat-option-text', 'PowerShot A480'))
      .first();
    suggestionSpan.click();
    // wait until product details page is loaded
    E2EUtil.wait4VisibleElement(productDetails.getPage());
    productDetails.addToCart();
    // quantity should change
    const product2QuantitySpan = productDetails.getProductQuantitySpan();
    E2EUtil.checkTextValue(
      product2QuantitySpan,
      '1',
      'Wrong product details add to cart button quantity'
    )
      .then(() => {
        // close add to cart modal
        const atcModal: AddedToCartModal = new AddedToCartModal();
        atcModal.closeModalWait();
      })
      .then(() => {
        // add same product to cart again
        productDetails.addToCart();
        const atcModal: AddedToCartModal = new AddedToCartModal();
        atcModal
          .closeModalWait()
          .then(() => {
            E2EUtil.checkTextValue(
              product2QuantitySpan,
              '2',
              'Wrong product details add to cart button quantity'
            );
          }) // then go to cart
          .then(() => {
            const minicartIcon = home.header.getMinicartIconComponent();
            browser
              .wait(ExpectedConditions.elementToBeClickable(minicartIcon))
              .then(() => {
                minicartIcon.click();
              });
          });
      });

    // wait for cart page to show up
    browser.wait(ExpectedConditions.urlContains('/cart'));
    //   // check if cart contains quantity 1 of 'Photosmart E317 Digital Camera'
    //   cart.checkCartEntry(
    //     'Photosmart E317 Digital Camera',
    //     1,
    //     '$114.12',
    //     '$114.12'
    //   );
    //   // check if cart contains quantity 2 of 'PowerShot A480'
    //   cart.checkCartEntry('PowerShot A480', 2, '$99.85', '$199.70');

    //   // check cart totals
    //   cart.checkCartSummary('$293.82', '$20.00', '$293.82');
  });

  it('should contains correct titles in cart', () => {
    // go to homepage
    home.navigateTo();
    addFirstCameraToCart(home, searchResults);
    // wait for cart page to show up
    browser.wait(ExpectedConditions.urlContains('/cart'));
    E2EUtil.wait4VisibleElement(cart.getCartDetails());
    cart.checkPageTitle();
    cart.checkCartId();
    cart.checkPageSubtitle(1, '$114.12');
  });

  it('should contains one product in cart', () => {
    // go to homepage
    home.navigateTo();
    addFirstCameraToCart(home, searchResults);
    // wait for cart page to show up
    browser.wait(ExpectedConditions.urlContains('/cart'));
    E2EUtil.wait4VisibleElement(cart.getCartDetails());
    cart.getCartEntries();
    const entries = cart.getCartEntries();
    entries.then(results => {
      expect(results.length).toBe(1);
      const entry = results[0];
      E2EUtil.getComponentWithinParentByCss(entry, '.item__info a')
        .getText()
        .then(title => {
          expect(title).toBe('Photosmart E317 Digital Camera');
        });
      E2EUtil.getComponentWithinParentByCss(entry, '.item__code')
        .getText()
        .then(code => {
          expect(code).toBe('ID: 300938');
        });
      E2EUtil.getComponentWithinParentByCss(entry, '.item__price')
        .getText()
        .then(price => {
          expect(price).toBe('Price: $114.12');
        });
      E2EUtil.getComponentWithinParentByCss(
        entry,
        '.item__quantity .item-counter p'
      )
        .getText()
        .then(count => {
          expect(count).toBe('1');
        });
      const picture = E2EUtil.getComponentWithinParent(entry, 'y-picture');
      expect(picture.isPresent()).toBeTruthy();
    });
  });
});
