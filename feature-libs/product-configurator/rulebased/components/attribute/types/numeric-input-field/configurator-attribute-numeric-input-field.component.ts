import { getLocaleId } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { ConfiguratorUISettingsConfig } from '../../../config/configurator-ui-settings.config';
import { ConfigFormUpdateEvent } from '../../../form/configurator-form.event';
import { ConfiguratorAttributeInputFieldComponent } from '../input-field/configurator-attribute-input-field.component';
import { ConfiguratorAttributeNumericInputFieldService } from './configurator-attribute-numeric-input-field.component.service';

@Component({
  selector: 'cx-configurator-attribute-numeric-input-field',
  templateUrl: './configurator-attribute-numeric-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeNumericInputFieldComponent
  extends ConfiguratorAttributeInputFieldComponent
  implements OnInit, OnDestroy {
  numericFormatPattern: string;
  locale: string;

  @Input() language: string;

  // TODO(#11681): make config a required dependency
  /**
   * @param {ConfiguratorAttributeNumericInputFieldService} configAttributeNumericInputFieldService Service for numeric formatting and validation.
   * @param {ConfiguratorUISettingsConfig} config Optional configuration for debounce time,
   * if omitted {@link FALLBACK_DEBOUNCE_TIME} is used instead.
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    configAttributeNumericInputFieldService: ConfiguratorAttributeNumericInputFieldService,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    config?: ConfiguratorUISettingsConfig
  );

  /**
   * @deprecated  since 3.3
   */
  constructor(
    configAttributeNumericInputFieldService: ConfiguratorAttributeNumericInputFieldService
  );

  constructor(
    protected configAttributeNumericInputFieldService: ConfiguratorAttributeNumericInputFieldService,
    protected config?: ConfiguratorUISettingsConfig
  ) {
    super(config);
  }

  /**
   * Do we need to display a validation message
   */
  mustDisplayValidationMessage(): boolean {
    const wrongFormat: boolean =
      (this.attributeInputForm.dirty || this.attributeInputForm.touched) &&
      this.attributeInputForm.errors?.wrongFormat;

    return wrongFormat;
  }

  ngOnInit() {
    //locales are available as 'languages' in the commerce backend
    this.locale = this.getInstalledLocale(this.language);

    this.attributeInputForm = new FormControl('', [
      this.configAttributeNumericInputFieldService.getNumberFormatValidator(
        this.locale,
        this.attribute.numDecimalPlaces,
        this.attribute.numTotalLength,
        this.attribute.negativeAllowed
      ),
    ]);
    const numDecimalPlaces = this.attribute.numDecimalPlaces;
    this.numericFormatPattern = this.configAttributeNumericInputFieldService.getPatternForValidationMessage(
      numDecimalPlaces,
      this.attribute.numTotalLength,
      this.attribute.negativeAllowed,
      this.locale
    );
    if (this.attribute.userInput) {
      this.attributeInputForm.setValue(this.attribute.userInput);
    }

    this.sub = this.attributeInputForm.valueChanges
      .pipe(
        debounce(() =>
          timer(
            this.config?.productConfigurator?.updateDebounceTime?.input ??
              this.FALLBACK_DEBOUNCE_TIME
          )
        )
      )
      .subscribe(() => this.onChange());
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /**
   * @deprecated since 3.3
   * This method should be removed because there is no use for this method.
   */
  protected createEventFromInput(): ConfigFormUpdateEvent {
    return {
      ownerKey: this.ownerKey,
      changedAttribute: {
        ...this.attribute,
        userInput: this.attributeInputForm.value,
      },
    };
  }

  protected getInstalledLocale(locale: string): string {
    try {
      getLocaleId(locale);
      return locale;
    } catch {
      this.reportMissingLocaleData(locale);
      return 'en';
    }
  }

  protected reportMissingLocaleData(lang: string): void {
    if (isDevMode()) {
      console.warn(
        `ConfigAttributeNumericInputFieldComponent: No locale data registered for '${lang}' (see https://angular.io/api/common/registerLocaleData).`
      );
    }
  }
}
