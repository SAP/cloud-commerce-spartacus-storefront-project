import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  Budget,
  Currency,
  CurrencyService,
  B2BUnitNode,
  OrgUnitService,
} from '@spartacus/core';
import { AbstractFormComponent } from '../../abstract-component/abstract-form.component';

@Component({
  selector: 'cx-budget-form',
  templateUrl: './budget-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent extends AbstractFormComponent
  implements OnInit {
  businessUnits$: Observable<B2BUnitNode[]>;
  currencies$: Observable<Currency[]>;

  @Input()
  budgetData: Budget;

  form: FormGroup = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
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
    protected fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected orgUnitService: OrgUnitService
  ) {
    super();
  }

  ngOnInit() {
    this.currencies$ = this.currencyService.getAll();
    this.orgUnitService.loadOrgUnitNodes();
    this.businessUnits$ = this.orgUnitService.getList();
    if (this.budgetData && Object.keys(this.budgetData).length !== 0) {
      this.form.patchValue(this.budgetData);
    }
  }
}
