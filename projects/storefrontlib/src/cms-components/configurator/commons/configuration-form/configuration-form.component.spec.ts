import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterState } from '@angular/router';
import {
  Configuration,
  ConfiguratorCommonsService,
  I18nTestingModule,
  RoutingService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ConfigurationFormComponent } from './configuration-form.component';

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

class MockConfiguratorCommonsService {
  createConfiguration(productCode: string): Observable<Configuration> {
    const productConfig: Configuration = {
      configId: 'a',
      consistent: true,
      complete: true,
      productCode: productCode,
    };
    return of(productConfig);
  }
}

describe('ConfigurationFormComponent', () => {
  let component: ConfigurationFormComponent;
  let fixture: ComponentFixture<ConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [ConfigurationFormComponent],
      providers: [
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },

        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationFormComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should get product code as part of product configuration', () => {
    component.ngOnInit();
    fixture.detectChanges();
    let productCode: string;
    component.configuration$.subscribe(
      (data: Configuration) => (productCode = data.productCode)
    );

    expect(productCode).toEqual(PRODUCT_CODE);
  });
});
