import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfiguratorAttributeSingleSelectionBaseComponent } from '../base/configurator-attribute-single-selection-base.component';

@Component({
  selector: 'cx-configurator-attribute-radio-button',
  templateUrl: './configurator-attribute-radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeRadioButtonComponent
  extends ConfiguratorAttributeSingleSelectionBaseComponent
  implements OnInit {
  attributeRadioButtonForm = new FormControl('');

  ngOnInit(): void {
    this.attributeRadioButtonForm.setValue(this.attribute.selectedSingleValue);
  }
}
