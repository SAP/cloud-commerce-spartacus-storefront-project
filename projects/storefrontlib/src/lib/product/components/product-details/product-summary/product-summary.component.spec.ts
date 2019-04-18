import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSummaryComponent } from '../product-summary/product-summary.component';
import { AddToCartModule } from '../../../../cart/add-to-cart/add-to-cart.module';
import { FormComponentsModule } from './../../../../ui/components/form-components/form-components.module';
import { OutletDirective } from '../../../../outlet';
import { I18nTestingModule } from '@spartacus/core';

describe('ProductSummaryComponent in product', () => {
  let productSummaryComponent: ProductSummaryComponent;
  let fixture: ComponentFixture<ProductSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AddToCartModule, FormComponentsModule, I18nTestingModule],
      declarations: [ProductSummaryComponent, OutletDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSummaryComponent);
    productSummaryComponent = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(productSummaryComponent).toBeTruthy();
  });

  it('should click tab with no classes', () => {
    const tabElement: HTMLElement = document.createElement('div');
    spyOn(tabElement, 'click');
    productSummaryComponent.clickTabIfInactive(tabElement);
    expect(tabElement.click).toHaveBeenCalled();
  });

  it('should not click tab with active class', () => {
    const tabElement: HTMLElement = document.createElement('div');
    tabElement.classList.add('active');
    spyOn(tabElement, 'click');
    productSummaryComponent.clickTabIfInactive(tabElement);
    expect(tabElement.click).not.toHaveBeenCalled();
  });

  it('should click tab with toggled classes', () => {
    const tabElement: HTMLElement = document.createElement('div');
    tabElement.classList.add('toggled');
    spyOn(tabElement, 'click');
    productSummaryComponent.clickTabIfInactive(tabElement);
    expect(tabElement.click).toHaveBeenCalled();
  });

  it('should click tab with active and toggled classes', () => {
    const tab: HTMLElement = document.createElement('div');
    tab.classList.add('active');
    tab.classList.add('toggled');
    spyOn(tab, 'click');
    productSummaryComponent.clickTabIfInactive(tab);
    expect(tab.click).toHaveBeenCalled();
  });

  it('should return correct tab from tabs component', () => {
    const tabsComponent: HTMLElement = document.createElement('div');
    const tab1: HTMLElement = document.createElement('h3');
    const tab2: HTMLElement = document.createElement('h3');
    const tab3: HTMLElement = document.createElement('h3');

    tab1.innerText = 'Tab 1';
    tab2.innerText = 'Tab 2';
    tab3.innerText = 'Tab 3';

    tabsComponent.appendChild(tab1);
    tabsComponent.appendChild(tab2);
    tabsComponent.appendChild(tab3);

    const result = productSummaryComponent.getTabByLabel(
      'Tab 2',
      tabsComponent
    );

    expect(result).toBe(tab2);
  });
});
