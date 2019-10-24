import { Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterState } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  Configurator,
  ConfiguratorCommonsService,
  ConfiguratorGroupsService,
  I18nTestingModule,
  RoutingService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { HamburgerMenuService } from '../../../../layout/header/hamburger-menu/hamburger-menu.service';
import { ConfigGroupMenuComponent } from './config-group-menu.component';

const PRODUCT_CODE = 'CONF_LAPTOP';

const mockRouterState: any = {
  state: {
    params: {
      rootProduct: PRODUCT_CODE,
    },
  },
};

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return of(mockRouterState);
  }
}

class MockRouter {
  public events = of('');
}

class MockConfiguratorCommonsService {
  public config: Configurator.Configuration = {
    configId: '1234-56-7890',
    consistent: true,
    complete: true,
    productCode: PRODUCT_CODE,
    groups: [
      {
        configurable: true,
        description: 'Core components',
        groupType: Configurator.GroupType.CSTIC_GROUP,
        id: '1-CPQ_LAPTOP.1',
        name: '1',
        attributes: [
          {
            label: 'Expected Number',
            name: 'EXP_NUMBER',
            required: true,
            uiType: Configurator.UiType.NOT_IMPLEMENTED,
            values: [],
          },
          {
            label: 'Processor',
            name: 'CPQ_CPU',
            required: true,
            selectedSingleValue: 'INTELI5_35',
            uiType: Configurator.UiType.RADIOBUTTON,
            values: [],
          },
        ],
      },
      {
        configurable: true,
        description: 'Peripherals & Accessories',
        groupType: Configurator.GroupType.CSTIC_GROUP,
        id: '1-CPQ_LAPTOP.2',
        name: '2',
        attributes: [],
      },
      {
        configurable: true,
        description: 'Software',
        groupType: Configurator.GroupType.CSTIC_GROUP,
        id: '1-CPQ_LAPTOP.3',
        name: '3',
        attributes: [],
      },
    ],
  };
  getConfiguration(): Observable<Configurator.Configuration> {
    return of(this.config);
  }
  hasConfiguration(): Observable<boolean> {
    return of(false);
  }
}

describe('ConfigurationGroupMenuComponent', () => {
  let component: ConfigGroupMenuComponent;
  let fixture: ComponentFixture<ConfigGroupMenuComponent>;
  let configuratorGroupsService: ConfiguratorGroupsService;
  let hamburgerMenuService: HamburgerMenuService;
  let htmlElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, ReactiveFormsModule, NgSelectModule],
      declarations: [ConfigGroupMenuComponent],
      providers: [
        ConfiguratorGroupsService,
        HamburgerMenuService,
        {
          provide: Router,
          useClass: MockRouter,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },

        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
      ],
    });
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGroupMenuComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    configuratorGroupsService = TestBed.get(ConfiguratorGroupsService as Type<
      ConfiguratorGroupsService
    >);
    hamburgerMenuService = TestBed.get(HamburgerMenuService as Type<
      HamburgerMenuService
    >);

    spyOn(configuratorGroupsService, 'setCurrentGroup').and.stub();
    spyOn(hamburgerMenuService, 'toggle').and.stub();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should get product code as part of product configuration', () => {
    component.ngOnInit();
    component.configuration$.subscribe((data: Configurator.Configuration) => {
      expect(data.productCode).toEqual(PRODUCT_CODE);
    });
  });

  it('should render 3 groups', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(htmlElem.querySelectorAll('.cx-config-menu-item').length).toBe(3);
  });

  it('should set current group in case of clicking on a group', () => {
    component.ngOnInit();
    fixture.detectChanges();

    component.click({ id: 'groupdId' });
    expect(configuratorGroupsService.setCurrentGroup).toHaveBeenCalled();
    expect(hamburgerMenuService.toggle).toHaveBeenCalled();
  });
});
