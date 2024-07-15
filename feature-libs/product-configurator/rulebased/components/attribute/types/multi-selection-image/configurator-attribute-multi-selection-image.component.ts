/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Config, useFeatureStyles } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { ConfiguratorCommonsService } from '../../../../core/facade/configurator-commons.service';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';
import { ConfiguratorDeltaRenderingService } from '../../delta-rendering/configurator-delta-rendering.service';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import { Observable } from 'rxjs';
import { ConfiguratorPriceComponentOptions } from '../../../price/configurator-price.component';

@Component({
  selector: 'cx-configurator-attribute-multi-selection-image',
  templateUrl: './configurator-attribute-multi-selection-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfiguratorDeltaRenderingService],
})
export class ConfiguratorAttributeMultiSelectionImageComponent
  extends ConfiguratorAttributeBaseComponent
  implements OnInit
{
  attribute: Configurator.Attribute;
  ownerKey: string;
  expMode: boolean;

  iconTypes = ICON_TYPE;
  protected config = inject(Config);
  protected configuratorDeltaRenderingService = inject(
    ConfiguratorDeltaRenderingService
  );

  rerender$: Observable<boolean>;

  constructor(
    protected configUtilsService: ConfiguratorStorefrontUtilsService,
    protected attributeComponentContext: ConfiguratorAttributeCompositionContext,
    protected configuratorCommonsService: ConfiguratorCommonsService
  ) {
    super();

    this.attribute = attributeComponentContext.attribute;
    this.ownerKey = attributeComponentContext.owner.key;
    this.expMode = attributeComponentContext.expMode;
    this.rerender$ = this.configuratorDeltaRenderingService.rerender(
      attributeComponentContext.isDeltaRendering ?? false,
      this.attribute.key ?? ''
    );

    useFeatureStyles('productConfiguratorAttributeTypesV2');
  }

  attributeCheckBoxForms = new Array<UntypedFormControl>();

  ngOnInit() {
    const values = this.attribute.values;
    if (values) {
      for (const value of values) {
        let attributeCheckBoxForm: UntypedFormControl;
        if (value.selected) {
          attributeCheckBoxForm = new UntypedFormControl(true);
        } else {
          attributeCheckBoxForm = new UntypedFormControl(false);
        }
        this.attributeCheckBoxForms.push(attributeCheckBoxForm);
      }
    }
  }

  /**
   * Fired when a value has been selected
   * @param index Index of selected value
   */
  onSelect(index: number): void {
    this.attributeCheckBoxForms[index].setValue(
      !this.attributeCheckBoxForms[index].value
    );

    const selectedValues =
      this.configUtilsService.assembleValuesForMultiSelectAttributes(
        this.attributeCheckBoxForms,
        this.attribute
      );

    this.configuratorCommonsService.updateConfiguration(
      this.ownerKey,
      {
        ...this.attribute,
        values: selectedValues,
      },
      Configurator.UpdateType.ATTRIBUTE
    );
  }

  /**
   * Extract corresponding value price formula parameters.
   * For the multi-selection attribute types the complete price formula should be displayed at the value level.
   *
   * @param {Configurator.Value} value - Configurator value
   * @return {ConfiguratorPriceComponentOptions} - New price formula
   */
  extractValuePriceFormulaParameters(
    value: Configurator.Value
  ): ConfiguratorPriceComponentOptions {
    value = this.configuratorDeltaRenderingService.mergePriceIntoValue(value);
    return {
      quantity: value.quantity,
      price: value.valuePrice,
      priceTotal: value.valuePriceTotal,
      isLightedUp: value.selected,
    };
  }

  protected getAriaLabelGeneric(
    attribute: Configurator.Attribute,
    value: Configurator.Value
  ): string {
    value = this.configuratorDeltaRenderingService.mergePriceIntoValue(value);
    return super.getAriaLabelGeneric(attribute, value);
  }
}
