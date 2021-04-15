import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorAttributeProductCardComponentOptions } from '../../product-card/configurator-attribute-product-card.component';
import { ConfiguratorAttributeQuantityComponentOptions } from '../../quantity/configurator-attribute-quantity.component';
import { ConfiguratorAttributeSingleSelectionBaseComponent } from '../base/configurator-attribute-single-selection-base.component';

@Component({
  selector: 'cx-configurator-attribute-single-selection-bundle-dropdown',
  templateUrl:
    './configurator-attribute-single-selection-bundle-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeSingleSelectionBundleDropdownComponent
  extends ConfiguratorAttributeSingleSelectionBaseComponent
  implements OnInit {
  attributeDropDownForm = new FormControl('');
  selectionValue: Configurator.Value | undefined;

  @Input() group: string;

  ngOnInit() {
    this.attributeDropDownForm.setValue(this.attribute?.selectedSingleValue);

    if (this.attribute?.values && this.attribute?.values?.length > 0) {
      this.selectionValue = this.attribute?.values.find(
        (value) => value.selected
      );
    }
  }

  /**
   TODO(issue: #11238): update @deprecated level to the release we are publishing with,
   It is still 3.1 only because app.module.ts states that we are on 3.1.
   Finally we must have 3.x, x>=2 here
   */
  /**
   * @deprecated since 3.1
   * User better onSelect('0')
   */
  onDeselect(): void {
    this.onSelect('0');
  }

  onChangeQuantity(eventObject: any): void {
    this.loading$.next(true);

    if (!eventObject) {
      this.attributeDropDownForm.setValue('');
    }
    super.onChangeQuantity(eventObject);
  }

  /**
   * Extract corresponding product card parameters
   *
   * @return {ConfiguratorAttributeProductCardComponentOptions} - New product card options
   */
  extractProductCardParameters(): ConfiguratorAttributeProductCardComponentOptions {
    return {
      hideRemoveButton: true,
      productBoundValue: this.selectionValue,
      singleDropdown: true,
      withQuantity: false,
      loading$: this.loading$,
      attributeId: this.attribute.attrCode,
    };
  }

  /**
   *  Extract corresponding quantity parameters
   *
   * @return {ConfiguratorAttributeQuantityComponentOptions} - New quantity options
   */
  extractQuantityParameters(): ConfiguratorAttributeQuantityComponentOptions {
    return super.extractQuantityParameters(this.attributeDropDownForm);
  }
}
