import { ChangeDetectionStrategy, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfiguratorGroupsService } from '../../../../core/facade/configurator-groups.service';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import { ConfiguratorAttributeCheckBoxListComponent } from './configurator-attribute-checkbox-list.component';
import { ConfiguratorAttributeQuantityService } from '../../quantity/configurator-attribute-quantity.service';
import {
  // CommonConfigurator,
  CommonConfiguratorTestUtilsService,
  // CommonConfiguratorUtilsService,
} from '@spartacus/product-configurator/common';

class MockGroupService {}
class MockConfiguratorAttributeQuantityService {
  readOnlyQuantity(value): boolean {
    return !value || value === '0';
  }
  withQuantity(
    dataType: Configurator.DataType,
    uiType: Configurator.UiType
  ): boolean {
    switch (uiType) {
      case Configurator.UiType.DROPDOWN_PRODUCT:
      case Configurator.UiType.DROPDOWN:
      case Configurator.UiType.RADIOBUTTON_PRODUCT:
      case Configurator.UiType.RADIOBUTTON:
        return dataType ===
          Configurator.DataType.USER_SELECTION_QTY_ATTRIBUTE_LEVEL
          ? true
          : false;

      case Configurator.UiType.CHECKBOXLIST:
      case Configurator.UiType.CHECKBOXLIST_PRODUCT:
        return dataType === Configurator.DataType.USER_SELECTION_QTY_VALUE_LEVEL
          ? true
          : false;

      default:
        return false;
    }
  }
}
@Directive({
  selector: '[cxFocus]',
})
export class MockFocusDirective {
  @Input('cxFocus') protected config;
}

describe('ConfigAttributeCheckBoxListComponent', () => {
  let component: ConfiguratorAttributeCheckBoxListComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeCheckBoxListComponent>;
  let htmlElem: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ConfiguratorAttributeCheckBoxListComponent,
          MockFocusDirective,
        ],
        imports: [ReactiveFormsModule, NgSelectModule],
        providers: [
          ConfiguratorAttributeBaseComponent,
          ConfiguratorStorefrontUtilsService,
          {
            provide: ConfiguratorGroupsService,
            useClass: MockGroupService,
          },
          {
            provide: ConfiguratorAttributeQuantityService,
            useClass: MockConfiguratorAttributeQuantityService,
          },
        ],
      })
        .overrideComponent(ConfiguratorAttributeCheckBoxListComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  function createValue(code: string, name: string, isSelected: boolean) {
    const value: Configurator.Value = {
      valueCode: code,
      name: name,
      selected: isSelected,
    };
    return value;
  }

  beforeEach(() => {
    const value1 = createValue('1', 'val1', true);
    const value2 = createValue('2', 'val2', false);
    const value3 = createValue('3', 'val3', true);
    const values: Configurator.Value[] = [value1, value2, value3];

    fixture = TestBed.createComponent(
      ConfiguratorAttributeCheckBoxListComponent
    );

    htmlElem = fixture.nativeElement;
    component = fixture.componentInstance;

    component.ownerKey = 'theOwnerKey';
    component.attribute = {
      dataType: Configurator.DataType.USER_SELECTION_QTY_ATTRIBUTE_LEVEL,
      name: 'attributeName',
      attrCode: 444,
      uiType: Configurator.UiType.CHECKBOXLIST,
      values: values,
      required: true,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 entries after init with first and last value filled', () => {
    expect(component.attributeCheckBoxForms.length).toBe(3);
    expect(component.attributeCheckBoxForms[0].value).toBe(true);
    expect(component.attributeCheckBoxForms[1].value).toBe(false);
    expect(component.attributeCheckBoxForms[2].value).toBe(true);
  });

  it('should select and deselect a checkbox value', () => {
    const checkboxId =
      '#cx-configurator--checkBoxList--' +
      component.attribute.name +
      '--' +
      component.attribute.values[1].valueCode;
    const valueToSelect = fixture.debugElement.query(By.css(checkboxId))
      .nativeElement;
    expect(valueToSelect.checked).toBeFalsy();
    // select value
    valueToSelect.click();
    fixture.detectChanges();
    expect(valueToSelect.checked).toBeTruthy();
    // deselect value
    valueToSelect.click();
    fixture.detectChanges();
    expect(valueToSelect.checked).toBeFalsy();
  });

  it('should call withQuantity', () => {
    expect(component.withQuantity).toBeFalsy();
  });

  it('should call readOnlyQuantity', () => {
    expect(component.readOnlyQuantity).toBeFalse();
  });

  it('should call emit of selectionChange onHandleAttributeQuantity', () => {
    const quantity = 2;

    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.onHandleAttributeQuantity(quantity);

    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        changedAttribute: jasmine.objectContaining({
          ...component.attribute,
          quantity,
        }),
        ownerKey: component.ownerKey,
        updateType: Configurator.UpdateType.ATTRIBUTE_QUANTITY,
      })
    );
  });

  it('should call emit of selectionChange onChangeValueQuantity', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.onChangeValueQuantity({ quantity: 0 }, '1', 0);

    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        changedAttribute: jasmine.objectContaining({
          ...component.attribute,
          values: [
            {
              name: 'val1',
              quantity: undefined,
              selected: false,
              valueCode: '1',
            },
            {
              name: 'val2',
              quantity: undefined,
              selected: false,
              valueCode: '2',
            },
            {
              name: 'val3',
              quantity: undefined,
              selected: true,
              valueCode: '3',
            },
          ],
        }),
        ownerKey: component.ownerKey,
        updateType: Configurator.UpdateType.ATTRIBUTE,
      })
    );
  });

  it('should call onHandleAttributeQuantity of event onChangeQuantity', () => {
    spyOn(component, 'onHandleAttributeQuantity');

    const quantity = { quantity: 2 };

    component.onChangeQuantity(quantity);

    expect(component.onHandleAttributeQuantity).toHaveBeenCalled();
  });

  it('should call onSelect of event onChangeQuantity', () => {
    spyOn(component, 'onSelect');

    const quantity = { quantity: 0 };

    component.onChangeQuantity(quantity);

    expect(component.onSelect).toHaveBeenCalled();
  });

  it('should call withQuantityOnAttributeLevel', () => {
    expect(component.withQuantityOnAttributeLevel).toBeTruthy();
  });

  it('should check allowZeroValueQuantity getter', () => {
    expect(component.allowZeroValueQuantity).toBeTruthy();
  });

  // HTML

  it('should not display attribute quantity when dataType is no quantity', () => {
    component.attribute.dataType = Configurator.DataType.USER_SELECTION_NO_QTY;

    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      'cx-configurator-attribute-quantity'
    );
  });

  it('should not display value quantity when dataType is no quantity', () => {
    component.attribute.dataType = Configurator.DataType.USER_SELECTION_NO_QTY;

    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      'cx-configurator-attribute-quantity'
    );
  });

  it('should display attribute quantity when dataType is with attribute quantity', () => {
    component.attribute.dataType =
      Configurator.DataType.USER_SELECTION_QTY_ATTRIBUTE_LEVEL;

    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configurator-attribute-quantity'
    );
  });

  it('should display value quantity when dataType is with value quantity', () => {
    component.attribute.dataType =
      Configurator.DataType.USER_SELECTION_QTY_VALUE_LEVEL;

    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configurator-attribute-quantity'
    );
  });
});
