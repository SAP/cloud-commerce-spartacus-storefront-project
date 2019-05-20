import { Injectable } from '@angular/core';
import { UserPaymentAdapter } from './user-payment.adapter';
import { Observable } from 'rxjs';
import { PaymentDetails } from '../../../model/cart.model';
import { Country, Region } from '../../../model/address.model';

@Injectable({
  providedIn: 'root',
})
export class UserPaymentConnector {
  constructor(protected adapter: UserPaymentAdapter) {}

  getAll(userId: string): Observable<PaymentDetails[]> {
    return this.adapter.loadAll(userId);
  }

  delete(userId: string, paymentMethodID: string): Observable<{}> {
    return this.adapter.delete(userId, paymentMethodID);
  }

  setDefault(userId: string, paymentMethodID: string): Observable<{}> {
    return this.adapter.setDefault(userId, paymentMethodID);
  }

  getBillingCountries(): Observable<Country[]> {
    return this.adapter.loadBillingCountries();
  }

  getDeliveryCountries(): Observable<Country[]> {
    return this.adapter.loadDeliveryCountries();
  }

  getRegions(countryIsoCode: string): Observable<Region[]> {
    return this.adapter.loadRegions(countryIsoCode);
  }
}
