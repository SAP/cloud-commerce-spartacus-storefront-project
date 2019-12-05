import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  Budget,
  Currency,
  CurrencyService,
  OrgUnit,
  UrlCommandRoute,
} from '@spartacus/core';
import { OrgUnitService } from '../../../../../../core/src/organization/facade/org-unit.service';
import { B2BUnitNode } from '../../../../../../core/src/model/org-unit.model';

@Component({
  selector: 'cx-budget-form',
  templateUrl: './budget-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent implements OnInit, OnDestroy {
  businessUnits$: Observable<B2BUnitNode[]>;
  currencies$: Observable<Currency[]>;

  @Input()
  budgetData: Budget;

  @Input()
  actionBtnLabel: string;

  @Input()
  cancelBtnLabel: string;

  @Input()
  showCancelBtn = true;

  @Input()
  routerBackLink: UrlCommandRoute = {
    cxRoute: 'budgets',
  };

  @Output()
  submitBudget = new EventEmitter<any>();

  @Output()
  clickBack = new EventEmitter<any>();

  budgetVerifySub: Subscription;

  // budget: FormGroup;
  budget: FormGroup = this.fb.group({
    code: [''],
    name: [''],
    orgUnit: this.fb.group({
      uid: [null, Validators.required],
    }),
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    currency: this.fb.group({
      isocode: [null, Validators.required],
    }),
    budget: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected orgUnitService: OrgUnitService
  ) {}

  ngOnInit() {
    this.currencies$ = this.currencyService.getAll();
    this.businessUnits$ = this.orgUnitService
      .getList({fields:'DEFAULT'})
      .pipe(
        map(list => list.unitNodes));

    this.businessUnits$.pipe(take(1)).subscribe(console.log)
  }

  currencySelected(currency: Currency): void {
    console.log(currency);
    this.budget['controls'].currency['controls'].isocode.setValue(
      currency.isocode
    );
  }

  businessUnitSelected(orgUnit: OrgUnit): void {
    console.log(orgUnit);
    this.budget['controls'].businessUnits['controls'].uid.setValue(orgUnit.uid);
    // this.businessUnits$.next(orgUnit.uid);
  }

  back(): void {
    this.clickBack.emit();
  }

  verifyBudget(): void {
    //budgetVerifySub
    // if (this.address.controls['region'].value.isocode) {
    //   this.regionsSub = this.regions$.pipe(take(1)).subscribe(regions => {
    //     const obj = regions.find(
    //       region =>
    //         region.isocode === this.address.controls['region'].value.isocode
    //     );
    //     Object.assign(this.address.value.region, {
    //       isocodeShort: obj.isocodeShort,
    //     });
    //   });
    // }
    //
    // if (this.address.dirty) {
    //   this.checkoutDeliveryService.verifyAddress(this.address.value);
    // } else {
    //   // address form value not changed
    //   // ignore duplicate address
    //   this.submitBudget.emit(undefined);
    // }
  }

  ngOnDestroy() {
    // this.checkoutDeliveryService.clearAddressVerificationResults();
    //
    // if (this.addressVerifySub) {
    //   this.addressVerifySub.unsubscribe();
    // }
    //
    // if (this.regionsSub) {
    //   this.regionsSub.unsubscribe();
    // }
  }
}
