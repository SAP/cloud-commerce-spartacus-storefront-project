/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  isDevMode,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfigFormUpdateEvent } from '../../../default-form/configurator-default-form.event';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeQuantityService } from '../../quantity/configurator-attribute-quantity.service';
import { ConfiguratorAttributeMultiSelectionBaseComponent } from '../base/configurator-attribute-multi-selection-base.component';

@Component({
  selector: 'cx-configurator-attribute-checkbox-list',
  templateUrl: './configurator-attribute-checkbox-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeCheckBoxListComponent
  extends ConfiguratorAttributeMultiSelectionBaseComponent
  implements OnInit
{
  attributeCheckBoxForms = new Array<UntypedFormControl>();

  @Input() group: string;
  @Input() uiKeyPrefix: string = '';

  constructor(
    protected configUtilsService: ConfiguratorStorefrontUtilsService,
    protected quantityService: ConfiguratorAttributeQuantityService
  ) {
    super(quantityService);
  }

  ngOnInit(): void {
    const disabled = !this.allowZeroValueQuantity;

    for (const value of this.attribute.values ?? []) {
      let attributeCheckBoxForm;

      if (value.selected) {
        attributeCheckBoxForm = new UntypedFormControl({
          value: true,
          disabled: disabled,
        });
      } else {
        attributeCheckBoxForm = new UntypedFormControl(false);
      }
      this.attributeCheckBoxForms.push(attributeCheckBoxForm);
    }
  }

  get allowZeroValueQuantity(): boolean {
    return this.quantityService.allowZeroValueQuantity(this.attribute);
  }

  onSelect(): void {
    const selectedValues =
      this.configUtilsService.assembleValuesForMultiSelectAttributes(
        this.attributeCheckBoxForms,
        this.attribute
      );

    const event: ConfigFormUpdateEvent = {
      changedAttribute: {
        ...this.attribute,
        values: selectedValues,
      },
      ownerKey: this.ownerKey,
      updateType: Configurator.UpdateType.ATTRIBUTE,
    };

    this.selectionChange.emit(event);
  }

  onChangeValueQuantity(
    eventObject: any,
    valueCode: string,
    formIndex: number
  ): void {
    if (eventObject === 0) {
      this.attributeCheckBoxForms[formIndex].setValue(false);
      this.onSelect();
      return;
    }

    const value: Configurator.Value | undefined = this.configUtilsService
      .assembleValuesForMultiSelectAttributes(
        this.attributeCheckBoxForms,
        this.attribute
      )
      .find((item) => item.valueCode === valueCode);

    if (!value) {
      if (isDevMode()) {
        console.warn('no value for event:', eventObject);
      }

      return;
    }

    value.quantity = eventObject;

    const event: ConfigFormUpdateEvent = {
      changedAttribute: {
        ...this.attribute,
        values: [value],
      },
      ownerKey: this.ownerKey,
      updateType: Configurator.UpdateType.VALUE_QUANTITY,
    };

    this.selectionChange.emit(event);
  }

  onChangeQuantity(eventObject: any): void {
    if (!eventObject) {
      this.attributeCheckBoxForms.forEach((_, index) =>
        this.attributeCheckBoxForms[index].setValue(false)
      );
      this.onSelect();
    } else {
      this.onHandleAttributeQuantity(eventObject);
    }
  }
}
