import { checkAllElements, TabElement } from '../tabbing-order';
import { fillShippingAddress } from '../../checkout-forms';
import { user } from '../../../sample-data/checkout-flow';

export function addressBookAddAddressTabbingOrder(config: TabElement[]) {
  cy.visit('/my-account/address-book');
  fillShippingAddress(user);

  cy.contains('Add new address').click();
  fillShippingAddress(user, false);

  cy.get('cx-address-book ng-select input')
    .first()
    .focus();

  checkAllElements(config);
}
