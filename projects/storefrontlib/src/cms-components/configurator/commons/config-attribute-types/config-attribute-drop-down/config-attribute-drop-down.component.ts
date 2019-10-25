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
import { ConfigUIKeyGeneratorService } from '../../service/config-ui-key-generator.service';
@Component({
  selector: 'cx-config-attribute-drop-down',
  templateUrl: './config-attribute-drop-down.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAttributeDropDownComponent implements OnInit {
  attributeDropDownForm = new FormControl('');

  constructor(public uiKeyGenerator: ConfigUIKeyGeneratorService) {}

  @Input() attribute: Configurator.Attribute;
  @Input() group: String;

  @Output() selectionChange = new EventEmitter();

  ngOnInit() {
    this.attributeDropDownForm.setValue(this.attribute.selectedSingleValue);
  }

  onSelect() {
    const event = {
      changedAttribute: {
        name: this.attribute.name,
        selectedSingleValue: this.attributeDropDownForm.value,
        uiType: this.attribute.uiType,
      },
      group: this.group,
    };

    this.selectionChange.emit(event);
  }
}
