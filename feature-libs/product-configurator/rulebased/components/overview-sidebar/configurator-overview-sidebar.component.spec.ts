import { Component, Input, Type } from '@angular/core';
import { I18nTestingModule } from '@spartacus/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  CommonConfigurator,
  ConfiguratorRouter,
  ConfiguratorRouterExtractorService,
} from '@spartacus/product-configurator/common';
import * as ConfigurationTestData from '../../testing/configurator-test-data';
import { Observable, of } from 'rxjs';
import { CommonConfiguratorTestUtilsService } from '../../../common/testing/common-configurator-test-utils.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorTestUtils } from '../../testing/configurator-test-utils';
import { ConfiguratorOverviewSidebarComponent } from './configurator-overview-sidebar.component';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';

import { ConfiguratorOverviewMenuComponent } from '../overview-menu/configurator-overview-menu.component';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';

const OWNER: CommonConfigurator.Owner =
  ConfigurationTestData.productConfiguration.owner;
const CONFIG_ID = '1234-56-7890';
const CONFIGURATION: Configurator.Configuration = {
  ...ConfiguratorTestUtils.createConfiguration(CONFIG_ID, OWNER),
  overview: ConfigurationTestData.productConfiguration.overview,
};

let component: ConfiguratorOverviewSidebarComponent;
let fixture: ComponentFixture<ConfiguratorOverviewSidebarComponent>;
let htmlElem: HTMLElement;
let defaultConfigObservable: any;
let configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService;

function initTestComponent() {
  fixture = TestBed.createComponent(ConfiguratorOverviewSidebarComponent);
  htmlElem = fixture.nativeElement;
  component = fixture.componentInstance;
  component.ghostStyle = false;
  fixture.detectChanges();

  configuratorStorefrontUtilsService = TestBed.inject(
    ConfiguratorStorefrontUtilsService as Type<ConfiguratorStorefrontUtilsService>
  );

  spyOn(configuratorStorefrontUtilsService, 'getElement').and.callThrough();
  spyOn(configuratorStorefrontUtilsService, 'changeStyling').and.stub();
}

class MockConfiguratorCommonsService {
  getConfiguration(): Observable<Configurator.Configuration> {
    return defaultConfigObservable;
  }
}

class MockConfiguratorRouterExtractorService {
  extractRouterData(): Observable<ConfiguratorRouter.Data> {
    return of(ConfigurationTestData.mockRouterState);
  }
}

class MockConfiguratorGroupsService {}

@Component({
  selector: 'cx-configurator-overview-filter',
  template: '',
})
class MockConfiguratorOverviewFilterComponent {
  @Input() showFilterBar: boolean = true;
  @Input() config: Configurator.ConfigurationWithOverview;
}

describe('ConfiguratorOverviewSidebarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        ConfiguratorOverviewSidebarComponent,
        ConfiguratorOverviewMenuComponent,
        MockConfiguratorOverviewFilterComponent,
      ],
      providers: [
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
        {
          provide: ConfiguratorGroupsService,
          useClass: MockConfiguratorGroupsService,
        },
        {
          provide: ConfiguratorRouterExtractorService,
          useClass: MockConfiguratorRouterExtractorService,
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
        },
      ],
    });
  });

  beforeEach(() => {
    defaultConfigObservable = of(CONFIGURATION);
  });

  it('should create component', () => {
    initTestComponent();
    expect(component).toBeDefined();
  });

  xit('should render overview menu component by default', () => {
    initTestComponent();
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configurator-overview-menu'
    );
  });

  xit('should render overview filter component when filter tab is selected', () => {
    initTestComponent();
    // click filter button
    fixture.debugElement
      .queryAll(By.css('.cx-menu-bar button'))[1]
      .triggerEventHandler('click');
    fixture.detectChanges();
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configurator-overview-filter'
    );
  });

  xit('should render overview menu component when menu tab is selected', () => {
    initTestComponent();
    component.onFilter();
    fixture.detectChanges();
    // click menu button
    fixture.debugElement
      .queryAll(By.css('.cx-menu-bar button'))[0]
      .triggerEventHandler('click');
    fixture.detectChanges();
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-configurator-overview-menu'
    );
  });

  it('should set showFilters to true by calling onFilter', () => {
    component.onFilter();
    expect(component.showFilter).toBe(true);
  });

  it('should set showFilters to false by calling onMenu', () => {
    component.showFilter = true;
    component.onMenu();
    expect(component.showFilter).toBe(false);
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      initTestComponent();
    });

    it('should set menu height based on overview form height', () => {
      const formHeight = 450;

      spyOn(configuratorStorefrontUtilsService, 'getHeight')
        .withArgs('cx-configurator-overview-form')
        .and.returnValue(formHeight)
        .withArgs('cx-configurator-overview-filter')
        .and.returnValue(0);

      component.ngOnChanges();

      expect(
        configuratorStorefrontUtilsService.changeStyling
      ).toHaveBeenCalled();

      expect(
        configuratorStorefrontUtilsService.changeStyling
      ).toHaveBeenCalledWith(
        'cx-configurator-overview-sidebar',
        'height',
        formHeight + 'px'
      );
    });

    it('should set menu height on overview form filter', () => {
      const formHeight = 450;
      const filterHeight = 800;

      spyOn(configuratorStorefrontUtilsService, 'getHeight')
        .withArgs('cx-configurator-overview-form')
        .and.returnValue(formHeight)
        .withArgs('cx-configurator-overview-filter')
        .and.returnValue(filterHeight);

      component.ngOnChanges();

      expect(
        configuratorStorefrontUtilsService.changeStyling
      ).toHaveBeenCalled();

      const height = filterHeight + 100;

      expect(
        configuratorStorefrontUtilsService.changeStyling
      ).toHaveBeenCalledWith(
        'cx-configurator-overview-sidebar',
        'height',
        height + 'px'
      );
    });
  });
});
