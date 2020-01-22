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
import { ConfigFormUpdateEvent } from '../../config-form/config-form.event';
import { ConfigUIKeyGeneratorService } from '../../service/config-ui-key-generator.service';

@Component({
  selector: 'cx-config-attribute-single-selection-image',
  templateUrl: './config-attribute-single-selection-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAttributeSingleSelectionImageComponent implements OnInit {
  constructor(public uiKeyGenerator: ConfigUIKeyGeneratorService) {}

  attributeRadioButtonForm = new FormControl('');

  @Input() attribute: Configurator.Attribute;
  @Input() group: string;
  @Input() ownerKey: string;

  @Output() selectionChange = new EventEmitter<ConfigFormUpdateEvent>();

  ngOnInit() {
    let selectedSingleValue: Configurator.Value;
    selectedSingleValue = this.attribute.values.find(
      value => value.selected === true
    );
    if (selectedSingleValue) {
      this.attributeRadioButtonForm.setValue(selectedSingleValue.valueCode);
    }
  }

  onEnter(event, index) {
    if (event.which !== 13) {
      return;
    }
    this.onSelect(index);
    //TODO: fix focus lose when selection with keyboard
  }

  onSelect(index) {
    const event: ConfigFormUpdateEvent = {
      productCode: this.ownerKey,
      changedAttribute: {
        name: this.attribute.name,
        selectedSingleValue: this.attribute.values[index].valueCode,
        uiType: this.attribute.uiType,
      },
      groupId: this.group,
    };

    this.selectionChange.emit(event);
  }
}
