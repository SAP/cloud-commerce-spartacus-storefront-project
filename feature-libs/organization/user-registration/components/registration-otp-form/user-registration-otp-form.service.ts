/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AuthConfigService,
  Country,
  Region,
  UserAddressService,
} from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { Title, UserRegisterFacade } from '@spartacus/user/profile/root';
import { Observable, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationOTPFormService {
  protected userRegisterFacade = inject(UserRegisterFacade);
  protected userAddressService = inject(UserAddressService);
  protected authConfigService = inject(AuthConfigService);
  protected formBuilder = inject(FormBuilder);

  private _form: FormGroup = this.buildForm();

  /*
   * Initializes form structure for registration.
   */
  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      titleCode: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, CustomFormValidators.emailValidator]],
      country: this.formBuilder.group({
        isocode: [null],
      }),
      line1: [''],
      line2: [''],
      town: [''],
      region: this.formBuilder.group({
        isocode: [null],
      }),
      postalCode: [''],
      phoneNumber: [''],
      message: [''],
    });
  }

  /*
   * Gets form structure for registration.
   */
  public get form(): FormGroup {
    return this._form;
  }

  /*
   * Gets form control for country isocode.
   */
  public get countryControl(): AbstractControl | null {
    return this.form.get('country.isocode');
  }

  /*
   *  Gets form control for region isocode.
   */
  public get regionControl(): AbstractControl | null {
    return this.form.get('region.isocode');
  }

  /**
   * Gets all title codes.
   */
  getTitles(): Observable<Title[]> {
    return this.userRegisterFacade.getTitles();
  }

  /**
   * Gets all countries list.
   */
  getCountries(): Observable<Country[]> {
    return this.userAddressService.getDeliveryCountries().pipe(
      tap((countries: Country[]) => {
        if (Object.keys(countries).length === 0) {
          this.userAddressService.loadDeliveryCountries();
        }
      })
    );
  }

  /**
   * Gets all regions list for specific selected country.
   */
  getRegions(): Observable<Region[]> {
    const regions: Region[] = [];
    return (
      this.countryControl?.valueChanges.pipe(
        filter((countryIsoCode) => !!countryIsoCode),
        switchMap((countryIsoCode) => {
          this.regionControl?.reset();
          return this.userAddressService.getRegions(countryIsoCode);
        })
      ) ?? of(regions)
    );
  }
}
