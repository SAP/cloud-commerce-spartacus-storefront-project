import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfigFormUpdateEvent } from '../../../form/configurator-form.event';
import { ConfiguratorAttributeQuantityService } from '../../quantity/configurator-attribute-quantity.service';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import {
  ConfiguratorAttributeQuantityComponentOptions,
  Quantity,
} from '../../quantity/configurator-attribute-quantity.component';

@Component({
  selector: 'cx-configurator-attribute-radio-button',
  templateUrl: './configurator-attribute-radio-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeRadioButtonComponent
  extends ConfiguratorAttributeBaseComponent
  implements OnInit {
  attributeRadioButtonForm = new FormControl('');
  loading$ = new BehaviorSubject<boolean>(false);

  @Input() attribute: Configurator.Attribute;
  @Input() ownerKey: string;

  @Output() selectionChange = new EventEmitter<ConfigFormUpdateEvent>();

  constructor(protected quantityService: ConfiguratorAttributeQuantityService) {
    super();
  }

  ngOnInit(): void {
    this.attributeRadioButtonForm.setValue(this.attribute.selectedSingleValue);
  }

  get withQuantity() {
    return this.quantityService.withQuantity(
      this.attribute.dataType,
      this.attribute.uiType
    );
  }

  get disableQuantityActions() {
    return this.quantityService.disableQuantityActions(
      this.attribute.selectedSingleValue
    );
  }

  onSelect(value: string): void {
    this.loading$.next(true);

    const event: ConfigFormUpdateEvent = {
      changedAttribute: {
        ...this.attribute,
        selectedSingleValue: value,
      },
      ownerKey: this.ownerKey,
      updateType: Configurator.UpdateType.ATTRIBUTE,
    };

    this.selectionChange.emit(event);
  }

  onDeselect(): void {
    this.loading$.next(true);

    const event: ConfigFormUpdateEvent = {
      changedAttribute: {
        ...this.attribute,
        selectedSingleValue: '',
      },
      ownerKey: this.ownerKey,
      updateType: Configurator.UpdateType.ATTRIBUTE,
    };

    this.selectionChange.emit(event);
  }

  onHandleQuantity(quantity): void {
    this.loading$.next(true);

    const event: ConfigFormUpdateEvent = {
      changedAttribute: {
        ...this.attribute,
        quantity,
      },
      ownerKey: this.ownerKey,
      updateType: Configurator.UpdateType.ATTRIBUTE_QUANTITY,
    };

    this.selectionChange.emit(event);
  }

  onChangeQuantity(eventObject): void {
    if (!eventObject.quantity) {
      this.onDeselect();
    } else {
      this.onHandleQuantity(eventObject.quantity);
    }
  }

  /**
   *  Extract corresponding quantity parameters
   *
   * @param {boolean} disableQuantityActions - Disable quantity actions
   * @return {ConfiguratorAttributeQuantityComponentOptions} - New quantity options
   */
  extractQuantityParameters(
    disableQuantityActions: boolean
  ): ConfiguratorAttributeQuantityComponentOptions {
    const initialQuantity: Quantity = {
      quantity: this.attribute.selectedSingleValue
        ? this.attribute.quantity
        : 0,
    };

    return {
      allowZero: !this.attribute.required,
      initialQuantity: initialQuantity,
      disableQuantityActions: disableQuantityActions,
    };
  }
}
