import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'cx-quick-order-form',
  templateUrl: './quick-order-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickOrderFormComponent implements OnInit {
  form: FormGroup;
  iconTypes = ICON_TYPE;

  constructor() {}

  ngOnInit(): void {
    this.build();
  }

  search(): void {
    // TODO
  }

  clear(): void {
    this.form.reset();
  }

  protected build() {
    const form = new FormGroup({});
    form.setControl('product', new FormControl(null));

    this.form = form;
  }
}
