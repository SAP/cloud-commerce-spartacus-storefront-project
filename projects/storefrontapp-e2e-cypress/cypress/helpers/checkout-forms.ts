export interface Address {
  line1: string;
  line2?: string;
  country: string;
  state?: string;
  postal: string;
  city: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
}

export interface PaymentDetails {
  fullName: string;
  payment: {
    card: string;
    number: string;
    expires: {
      month: string;
      year: string;
    };
    cvv: string;
  };
}

export function fillShippingAddress(shippingAddress: AddressData) {
  cy.get('cx-address-form').within(() => {
    cy.get('.country-select[formcontrolname="isocode"]').ngSelect(
      shippingAddress.address.country
    );
    cy.get('[formcontrolname="titleCode"]').ngSelect('Mr.');
    cy.get('[formcontrolname="firstName"]').type(shippingAddress.firstName);
    cy.get('[formcontrolname="lastName"]').type(shippingAddress.lastName);
    cy.get('[formcontrolname="line1"]').type(shippingAddress.address.line1);
    if (shippingAddress.address.line2) {
      cy.get('[formcontrolname="line2"]').type(shippingAddress.address.line2);
    }
    cy.get('[formcontrolname="town"]').type(shippingAddress.address.city);
    if (shippingAddress.address.state) {
      cy.get('.region-select[formcontrolname="isocode"]').ngSelect(
        shippingAddress.address.state
      );
    }
    cy.get('[formcontrolname="postalCode"]').type(
      shippingAddress.address.postal
    );
    cy.get('[formcontrolname="phone"]').type(shippingAddress.phone);
    cy.get('button.btn-primary').click();
  });
}

export function fillBillingAddress(billingAddress: AddressData) {
  cy.get('.cx-payment-form-billing').within(() => {
    cy.get('input[type="checkbox"]').click();
    cy.get('[bindvalue="isocode"]').ngSelect(billingAddress.address.country);
    cy.get('[formcontrolname="firstName"]').type(billingAddress.firstName);
    cy.get('[formcontrolname="lastName"]').type(billingAddress.lastName);
    cy.get('[formcontrolname="line1"]').type(billingAddress.address.line1);
    if (billingAddress.address.line2) {
      cy.get('[formcontrolname="line2"]').type(billingAddress.address.line2);
    }
    cy.get('[formcontrolname="town"]').type(billingAddress.address.city);
    if (billingAddress.address.state) {
      cy.get('[formcontrolname="isocodeShort"]').ngSelect(
        billingAddress.address.state
      );
    }
    cy.get('[formcontrolname="postalCode"]').type(
      billingAddress.address.postal
    );
  });
}

export function fillPaymentDetails(
  paymentDetails: PaymentDetails,
  billingAddress?: AddressData
) {
  cy.get('cx-payment-form').within(() => {
    cy.get('[bindValue="code"]').ngSelect(paymentDetails.payment.card);
    cy.get('[formcontrolname="accountHolderName"]').type(
      paymentDetails.fullName
    );
    cy.get('[formcontrolname="cardNumber"]').type(
      paymentDetails.payment.number
    );
    cy.get('[bindValue="expiryMonth"]').ngSelect(
      paymentDetails.payment.expires.month
    );
    cy.get('[bindValue="expiryYear"]').ngSelect(
      paymentDetails.payment.expires.year
    );
    cy.get('[formcontrolname="cvn"]').type(paymentDetails.payment.cvv);
    if (billingAddress) {
      fillBillingAddress(billingAddress);
    }
    cy.get('button.btn-primary').click();
  });
}
