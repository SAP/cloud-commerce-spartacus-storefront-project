import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Configurator,
  ConfiguratorCommonsService,
  GenericConfigurator,
  I18nTestingModule,
  RouterState,
  RoutingService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ConfigPriceSummaryComponent } from './config-price-summary.component';

const PRODUCT_CODE = 'CONF_LAPTOP';

const mockRouterState: any = {
  state: {
    params: {
      entityKey: PRODUCT_CODE,
      ownerType: GenericConfigurator.OwnerType.PRODUCT,
    },
    queryParams: {},
    url: 'CONFIG_OVERVIEW_URL',
  },
};

const config: Configurator.Configuration = {
  configId: '1234-56-7890',
  consistent: true,
  complete: true,
  productCode: PRODUCT_CODE,
  priceSummary: {
    basePrice: {
      formattedValue: '22.000 €',
    },
    selectedOptions: {
      formattedValue: '900 €',
    },
    currentTotal: {
      formattedValue: '22.900 €',
    },
  },
};

let routerStateObservable = null;
class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }
}

class MockConfiguratorCommonsService {
  getConfiguration(): Observable<Configurator.Configuration> {
    return of(config);
  }
}

describe('ConfigPriceSummaryComponent', () => {
  let component: ConfigPriceSummaryComponent;
  let fixture: ComponentFixture<ConfigPriceSummaryComponent>;

  beforeEach(async(() => {
    routerStateObservable = of(mockRouterState);
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [ConfigPriceSummaryComponent],
      providers: [
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },

        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    })
      .overrideComponent(ConfigPriceSummaryComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPriceSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should get product code and prices as part of product configuration', () => {
    component.configuration$
      .subscribe((data: Configurator.Configuration) => {
        expect(data.productCode).toEqual(PRODUCT_CODE);
        expect(data.priceSummary.basePrice).toEqual(
          config.priceSummary.basePrice
        );
      })
      .unsubscribe();
  });
});
