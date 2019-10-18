import { Injectable } from '@angular/core';
import { Configurator } from '../../../../../model/configurator.model';
import { Converter } from '../../../../../util/converter.service';
import { OccConfigurator } from '../occ-configurator.models';

@Injectable()
export class OccConfiguratorVariantNormalizer
  implements
    Converter<OccConfigurator.Configuration, Configurator.Configuration> {
  constructor() {}

  convert(
    source: OccConfigurator.Configuration,
    target?: Configurator.Configuration
  ): Configurator.Configuration {
    target = {
      configId: source.configId,
      complete: source.complete,
      attributes: [],
    };

    source.groups.forEach(group => this.convertGroup(group, target.attributes));
    return target;
  }

  convertGroup(
    source: OccConfigurator.Group,
    attributeList: Configurator.Attribute[]
  ) {
    source.cstics.forEach(cstic =>
      this.convertCharacteristic(cstic, attributeList)
    );
  }

  convertCharacteristic(
    cstic: OccConfigurator.Characteristic,
    attributeList: Configurator.Attribute[]
  ): void {
    const attribute: Configurator.Attribute = {
      name: cstic.name,
      label: cstic.langdepname,
      required: cstic.required,
      uiType: this.convertCharacteristicType(cstic.type),
      values: [],
      userInput: cstic.formattedValue ? cstic.formattedValue : cstic.value,
      maxlength: cstic.maxlength,
    };
    if (cstic.domainvalues) {
      cstic.domainvalues.forEach(value =>
        this.convertValue(value, attribute.values)
      );
      this.setSelectedSingleValue(attribute);
    }
    attributeList.push(attribute);
  }

  setSelectedSingleValue(attribute: Configurator.Attribute) {
    const selectedValues = attribute.values
      .map(entry => entry)
      .filter(entry => entry.selected);
    if (selectedValues && selectedValues.length === 1) {
      attribute.selectedSingleValue = selectedValues[0].valueCode;
    }
  }

  convertValue(
    occValue: OccConfigurator.Value,
    values: Configurator.Value[]
  ): void {
    const value: Configurator.Value = {
      valueCode: occValue.key,
      valueDisplay: occValue.langdepname,
      selected: occValue.selected,
    };

    values.push(value);
  }

  convertCharacteristicType(type: OccConfigurator.UiType): Configurator.UiType {
    let uiType: Configurator.UiType;
    switch (type) {
      case OccConfigurator.UiType.RADIO_BUTTON: {
        uiType = Configurator.UiType.RADIOBUTTON;
        break;
      }
      case OccConfigurator.UiType.DROPDOWN: {
        uiType = Configurator.UiType.DROPDOWN;
        break;
      }
      case OccConfigurator.UiType.STRING: {
        uiType = Configurator.UiType.STRING;
        break;
      }
      case OccConfigurator.UiType.READ_ONLY: {
        uiType = Configurator.UiType.READ_ONLY;
        break;
      }
      default: {
        uiType = Configurator.UiType.NOT_IMPLEMENTED;
      }
    }
    return uiType;
  }
}
