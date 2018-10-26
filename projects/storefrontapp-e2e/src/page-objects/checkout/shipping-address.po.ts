import { by, element, ElementFinder } from 'protractor';
import { E2EUtil } from '../../e2e-util';
import { AddressForm } from './address-form.po';

export class ShippingAddress {
  constructor(
    private parentElement: ElementFinder = element(by.tagName('y-root'))
  ) {}

  readonly container: ElementFinder = this.parentElement.element(
    by.tagName('y-shipping-address')
  );

  readonly header: ElementFinder = this.container.element(
    by.css('h3.y-shipping-address__title')
  );

  readonly addressForm: AddressForm = new AddressForm(this.container);

  async waitForReady() {
    await E2EUtil.wait4VisibleElement(this.container);
  }
}
