import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';
import { CommonConfiguratorTestUtilsService } from '@spartacus/product-configurator/common';
import { ItemCounterComponent, MediaModule } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorShowMoreComponent } from '../../../show-more/configurator-show-more.component';
import { ConfiguratorAttributeProductCardComponent } from '../../product-card/configurator-attribute-product-card.component';
import { ConfiguratorAttributeQuantityService } from '../../quantity/configurator-attribute-quantity.service';
import { ConfiguratorAttributeMultiSelectionBundleComponent } from './configurator-attribute-multi-selection-bundle.component';

@Component({
  selector: 'cx-configurator-attribute-product-card',
  template: '',
})
class MockProductCardComponent {}

class MockConfiguratorAttributeQuantityService {
  disableQuantityActions(value): boolean {
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

describe('ConfiguratorAttributeMultiSelectionBundleComponent', () => {
  let component: ConfiguratorAttributeMultiSelectionBundleComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeMultiSelectionBundleComponent>;
  let htmlElem: HTMLElement;

  const createImage = (url: string, altText: string): Configurator.Image => {
    const image: Configurator.Image = {
      url: url,
      altText: altText,
    };
    return image;
  };

  const createValue = (
    description: string,
    images: Configurator.Image[],
    name,
    quantity: number,
    selected: boolean,
    valueCode: string,
    valueDisplay: string
  ): Configurator.Value => {
    const value: Configurator.Value = {
      description,
      images,
      name,
      quantity,
      selected,
      valueCode,
      valueDisplay,
    };
    return value;
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule,
          RouterTestingModule,
          UrlTestingModule,
          ReactiveFormsModule,
          MediaModule,
        ],
        declarations: [
          ConfiguratorAttributeMultiSelectionBundleComponent,
          ConfiguratorShowMoreComponent,
          ItemCounterComponent,
          MockProductCardComponent,
        ],
      })
        .overrideComponent(ConfiguratorAttributeMultiSelectionBundleComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
            providers: [
              {
                provide: ConfiguratorAttributeProductCardComponent,
                useClass: MockProductCardComponent,
              },
              {
                provide: ConfiguratorAttributeQuantityService,
                useClass: MockConfiguratorAttributeQuantityService,
              },
            ],
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    const values: Configurator.Value[] = [
      createValue(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        [createImage('url', 'alt')],
        'valueName',
        1,
        true,
        '1111',
        'Lorem Ipsum Dolor'
      ),
      createValue(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        [createImage('url', 'alt')],
        'valueName',
        1,
        true,
        '2222',
        'Lorem Ipsum Dolor'
      ),
      createValue(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        [createImage('url', 'alt')],
        'valueName',
        1,
        false,
        '3333',
        'Lorem Ipsum Dolor'
      ),
      createValue(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        [createImage('url', 'alt')],
        'valueName',
        1,
        false,
        '4444',
        'Lorem Ipsum Dolor'
      ),
    ];

    fixture = TestBed.createComponent(
      ConfiguratorAttributeMultiSelectionBundleComponent
    );
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    component.ownerKey = 'theOwnerKey';
    component.attribute = {
      name: 'attributeName',
      attrCode: 1111,
      uiType: Configurator.UiType.CHECKBOXLIST_PRODUCT,
      required: true,
      groupId: 'testGroup',
      values: values,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 multi selection bundle items after init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const cardList = htmlElem.querySelectorAll(
      'cx-configurator-attribute-product-card'
    );

    expect(cardList.length).toBe(4);
  });

  it('should mark two items as selected', () => {
    component.ngOnInit();

    expect(component.attribute.values[0].selected).toEqual(true);
    expect(component.attribute.values[1].selected).toEqual(true);
    expect(component.attribute.values[2].selected).toEqual(false);
    expect(component.attribute.values[3].selected).toEqual(false);
  });

  it('should call selectionChange on event onChangeValueQuantity', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.ngOnInit();

    component.onChangeValueQuantity({
      valueCode: '1111',
      quantity: 2,
    });

    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        changedAttribute: jasmine.objectContaining({
          ...component.attribute,
          values: [
            {
              name: 'valueName',
              quantity: 2,
              selected: true,
              valueCode: '1111',
            },
          ],
        }),
        ownerKey: component.ownerKey,
        updateType: Configurator.UpdateType.VALUE_QUANTITY,
      })
    );
  });

  it('should call selectionChange on event onDeselect', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.ngOnInit();

    component.onDeselect('1111');

    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        changedAttribute: jasmine.objectContaining({
          ...component.attribute,
          values: [
            {
              name: 'valueName',
              quantity: 1,
              selected: false,
              valueCode: '1111',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: true,
              valueCode: '2222',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: false,
              valueCode: '3333',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: false,
              valueCode: '4444',
            },
          ],
        }),
        ownerKey: component.ownerKey,
        updateType: Configurator.UpdateType.ATTRIBUTE,
      })
    );
  });

  it('should call selectionChange on event onSelect', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.ngOnInit();

    component.onSelect('3333');

    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        changedAttribute: jasmine.objectContaining({
          ...component.attribute,
          values: [
            {
              name: 'valueName',
              quantity: 1,
              selected: true,
              valueCode: '1111',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: true,
              valueCode: '2222',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: true,
              valueCode: '3333',
            },
            {
              name: 'valueName',
              quantity: 1,
              selected: false,
              valueCode: '4444',
            },
          ],
        }),
        ownerKey: component.ownerKey,
        updateType: Configurator.UpdateType.ATTRIBUTE,
      })
    );
  });

  it('should call selectionChange on event onDeselectAll', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();

    component.ngOnInit();

    component.onDeselectAll();

    expect(component.selectionChange.emit).toHaveBeenCalled();
  });

  it('should call onHandleAttributeQuantity of event onChangeAttributeQuantity', () => {
    spyOn(component, 'onHandleAttributeQuantity');

    const quantity = { quantity: 2 };

    component.onChangeAttributeQuantity(quantity);

    expect(component.onHandleAttributeQuantity).toHaveBeenCalled();
  });

  it('should call onDeselectAll of event onChangeAttributeQuantity', () => {
    spyOn(component, 'onDeselectAll');

    const quantity = { quantity: 0 };

    component.onChangeAttributeQuantity(quantity);

    expect(component.onDeselectAll).toHaveBeenCalled();
  });

  it('should not display attribute quantity when dataType is no quantity', () => {
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
});
