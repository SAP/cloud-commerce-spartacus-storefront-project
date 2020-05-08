import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Configurator, GenericConfigurator, I18nTestingModule } from "@spartacus/core";
import { ConfigAttributeFooterComponent } from './config-attribute-footer.component';

describe('ConfigAttributeFooterComponent', () => {
  let classUnderTest: ConfigAttributeFooterComponent;
  let fixture: ComponentFixture<ConfigAttributeFooterComponent>;
  const currentAttribute: Configurator.Attribute = {
    name: 'attributeId',
    uiType: Configurator.UiType.RADIOBUTTON,
  };
  let htmlElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [ConfigAttributeFooterComponent],
    })
      .overrideComponent(ConfigAttributeFooterComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAttributeFooterComponent);
    classUnderTest = fixture.componentInstance;
    htmlElem = fixture.nativeElement;
    classUnderTest.attribute = currentAttribute;
    classUnderTest.attribute.label = 'label of attribute';
    classUnderTest.attribute.name = '123';
    classUnderTest.attribute.incomplete = true;
    classUnderTest.attribute.required = false;
    classUnderTest.attribute.uiType = Configurator.UiType.STRING;
    classUnderTest.attribute.userInput = undefined;
    classUnderTest.ownerType = GenericConfigurator.OwnerType.CART_ENTRY;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(classUnderTest).toBeTruthy();
  });

  it('should render a required message if attribute has no value, yet.', () => {
    classUnderTest.attribute.required = true;
    fixture.detectChanges();
    expectElementPresent(
      htmlElem,
      '.cx-config-attribute-footer-required-error-msg'
    );
  });

  it("shouldn't render a required message if attribute is incomplete, but not required.", () => {
    fixture.detectChanges();
    expectElementNotPresent(
      htmlElem,
      '.cx-config-attribute-footer-required-error-msg'
    );
  });

  it("shouldn't render a required message because attribute is a drop-down list.", () => {
    classUnderTest.attribute.uiType = Configurator.UiType.DROPDOWN;
    classUnderTest.attribute.required = true;
    fixture.detectChanges();
    expectElementNotPresent(
      htmlElem,
      '.cx-config-attribute-footer-required-error-msg'
    );
  });

  it("shouldn't render a required message because attribute has not been added to the cart yet.", () => {
    classUnderTest.ownerType = GenericConfigurator.OwnerType.PRODUCT;
    classUnderTest.attribute.required = true;
    fixture.detectChanges();
    expectElementNotPresent(
      htmlElem,
      '.cx-config-attribute-footer-required-error-msg'
    );
  });

  it('should return default message key for input string attributes', () => {
    classUnderTest.attribute.uiType = Configurator.UiType.STRING;
    expect(classUnderTest.getRequiredMessageKey()).toContain(
      'defaultRequiredMessage'
    );
  });
});

export function expectElementPresent(
  htmlElement: Element,
  querySelector: string
) {
  expect(htmlElement.querySelectorAll(querySelector).length).toBeGreaterThan(
    0,
    "expected element identified by selector '" +
      querySelector +
      "' to be present, but it is NOT! innerHtml: " +
      htmlElement.innerHTML
  );
}

export function expectElementNotPresent(
  htmlElement: Element,
  querySelector: string
) {
  expect(htmlElement.querySelectorAll(querySelector).length).toBe(
    0,
    "expected element identified by selector '" +
      querySelector +
      "' to be NOT present, but it is! innerHtml: " +
      htmlElement.innerHTML
  );
}
