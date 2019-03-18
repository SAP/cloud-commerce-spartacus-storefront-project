import * as addressBook from '../../helpers/address-book';
import { formats } from '../../sample-data/viewports';

describe('Address management page', () => {
  before(() =>
    cy.window().then(win => {
      win.sessionStorage.clear();
    })
  );

  addressBook.addressPage();
});

describe(`${formats.mobile.width +
  1}p resolution - Address management page`, () => {
  before(() => {
    cy.viewport(formats.mobile.width, formats.mobile.height);
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  beforeEach(() => {
    cy.viewport(formats.mobile.width, formats.mobile.height);
  });

  addressBook.addressPage();
});
