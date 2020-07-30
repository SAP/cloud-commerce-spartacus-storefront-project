import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Configurator } from '@spartacus/core';
import { ConfigFormUpdateEvent } from '../../../config-form/config-form.event';
import { ConfigUIKeyGenerator } from '../../../service/config-ui-key-generator';
@Component({
  selector: 'cx-config-attribute-drop-down',
  templateUrl: './config-attribute-drop-down.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAttributeDropDownComponent implements OnInit {
  attributeDropDownForm = new FormControl('');
  @Input() attribute: Configurator.Attribute;
  @Input() group: string;
  @Input() ownerKey: string;

  @Output() selectionChange = new EventEmitter<ConfigFormUpdateEvent>();

  ngOnInit() {
    this.attributeDropDownForm.setValue(this.attribute.selectedSingleValue);
  }
  /**
   * Triggered when a value has been selected
   */
  onSelect(): void {
    const event: ConfigFormUpdateEvent = {
      productCode: this.ownerKey,
      changedAttribute: {
        name: this.attribute.name,
        selectedSingleValue: this.attributeDropDownForm.value,
        uiType: this.attribute.uiType,
      },
      groupId: this.group,
    };
    this.selectionChange.emit(event);
  }

  createAttributeIdForConfigurator(attribute: Configurator.Attribute): string {
    return ConfigUIKeyGenerator.createAttributeIdForConfigurator(attribute);
  }
}
