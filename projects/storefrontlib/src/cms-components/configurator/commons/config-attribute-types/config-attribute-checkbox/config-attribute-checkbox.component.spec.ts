import { ConfigAttributeCheckBoxComponent } from './config-attribute-checkbox.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigUIKeyGeneratorService } from '../../service/config-ui-key-generator.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Configurator } from 'projects/core/src/model/configurator.model';
import { By } from '@angular/platform-browser';

describe('ConfigAttributeCheckBoxComponent', () => {
  let component: ConfigAttributeCheckBoxComponent;
  let fixture: ComponentFixture<ConfigAttributeCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigAttributeCheckBoxComponent],
      imports: [ReactiveFormsModule, NgSelectModule],
      providers: [ConfigUIKeyGeneratorService],
    })
      .overrideComponent(ConfigAttributeCheckBoxComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

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

    fixture = TestBed.createComponent(ConfigAttributeCheckBoxComponent);
    component = fixture.componentInstance;

    component.attribute = {
      name: 'attributeName',
      attrCode: 444,
      uiType: Configurator.UiType.CHECKBOXLIST,
      values: values,
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
      '#cx-config--checkBoxList--' +
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
});
