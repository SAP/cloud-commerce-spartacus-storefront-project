import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserIdService } from '../../auth/user-auth/facade/user-id.service';
import {
  Address,
  AddressValidation,
  Country,
  Region,
} from '../../model/address.model';
import { StateWithProcess } from '../../process/store/process-state';
import { UserActions } from '../store/actions/index';
import { UsersSelectors } from '../store/selectors/index';
import { StateWithUser } from '../store/user-state';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  constructor(
    protected store: Store<StateWithUser | StateWithProcess<void>>,
    protected userIdService: UserIdService
  ) {}

  /**
   * Retrieves user's addresses
   */
  loadAddresses(): void {
    this.userIdService.invokeWithUserId((userId) => {
      this.store.dispatch(new UserActions.LoadUserAddresses(userId));
    });
  }

  /**
   * Adds user address
   * @param address a user address
   */
  addUserAddress(address: Address): void {
    this.userIdService.invokeWithUserId((userId) => {
      this.store.dispatch(
        new UserActions.AddUserAddress({
          userId,
          address,
        })
      );
    });
  }

  /**
   * Sets user address as default
   * @param addressId a user address ID
   */
  setAddressAsDefault(addressId: string): void {
    this.userIdService.invokeWithUserId((userId) => {
      this.store.dispatch(
        new UserActions.UpdateUserAddress({
          userId,
          addressId,
          address: { defaultAddress: true },
        })
      );
    });
  }

  /**
   * Updates existing user address
   * @param addressId a user address ID
   * @param address a user address
   */
  updateUserAddress(addressId: string, address: Address): void {
    this.userIdService.invokeWithUserId((userId) => {
      this.store.dispatch(
        new UserActions.UpdateUserAddress({
          userId,
          addressId,
          address,
        })
      );
    });
  }

  /**
   * Deletes existing user address
   * @param addressId a user address ID
   */
  deleteUserAddress(addressId: string): void {
    this.userIdService.invokeWithUserId((userId) => {
      this.store.dispatch(
        new UserActions.DeleteUserAddress({
          userId,
          addressId,
        })
      );
    });
  }

  /**
   * Returns addresses
   */
  getAddresses(): Observable<Address[]> {
    return this.store.pipe(select(UsersSelectors.getAddresses));
  }

  /**
   * Returns a loading flag for addresses
   */
  getAddressesLoading(): Observable<boolean> {
    return this.store.pipe(select(UsersSelectors.getAddressesLoading));
  }

  getAddressesLoadedSuccess(): Observable<boolean> {
    return this.store.pipe(select(UsersSelectors.getAddressesLoadedSuccess));
  }
  /**
   * Retrieves delivery countries
   */
  loadDeliveryCountries(): void {
    this.store.dispatch(new UserActions.LoadDeliveryCountries());
  }

  /**
   * Returns all delivery countries
   */
  getDeliveryCountries(): Observable<Country[]> {
    return this.store.pipe(select(UsersSelectors.getAllDeliveryCountries));
  }

  /**
   * Returns a country based on the provided `isocode`
   * @param isocode an isocode for a country
   */
  getCountry(isocode: string): Observable<Country> {
    return this.store.pipe(
      select(UsersSelectors.countrySelectorFactory(isocode))
    );
  }

  /**
   * Retrieves regions for specified country by `countryIsoCode`
   * @param countryIsoCode
   */
  loadRegions(countryIsoCode: string): void {
    this.store.dispatch(new UserActions.LoadRegions(countryIsoCode));
  }

  /**
   * Clear regions in store - useful when changing country
   */
  clearRegions(): void {
    this.store.dispatch(new UserActions.ClearRegions());
  }

  /**
   * Returns all regions
   */
  getRegions(countryIsoCode: string): Observable<Region[]> {
    return this.store.pipe(
      select(UsersSelectors.getRegionsDataAndLoading),
      map(({ regions, country, loading, loaded }) => {
        if (!countryIsoCode && (loading || loaded)) {
          this.clearRegions();
          return [];
        } else if (loading && !loaded) {
          // don't interrupt loading
          return [];
        } else if (!loading && countryIsoCode !== country && countryIsoCode) {
          // country changed - clear store and load new regions
          if (country) {
            this.clearRegions();
          }
          this.loadRegions(countryIsoCode);
          return [];
        }
        return regions;
      })
    );
  }
  /**
   * Verifies the address
   * @param address : the address to be verified
   */
  verifyAddress(address: Address): void {
    let userId;
    this.userIdService
      .getUserId()
      .subscribe((occUserId) => (userId = occUserId))
      .unsubscribe();
    if (userId) {
      this.store.dispatch(
        new UserActions.VerifyUserAddress({
          userId,
          address,
        })
      );
    }
  }
  /**
   * Get address verification results
   */
  getAddressVerificationResults(): Observable<AddressValidation | string> {
    return this.store.pipe(
      select(UsersSelectors.getUserAddressVerificationResults),
      filter((results) => Object.keys(results).length !== 0)
    );
  }
  /**
   * Clear address verification results
   */
  clearAddressVerificationResults(): void {
    this.store.dispatch(new UserActions.ClearUserAddressVerificationResults());
  }
}
