import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyInterestsComponent } from './my-interests.component';
import {
  PipeTransform,
  Pipe,
  Component,
  DebugElement,
  Input,
} from '@angular/core';
import { of } from 'rxjs';
import { LayoutConfig } from '../../../layout/config/layout-config';
import {
  I18nTestingModule,
  ProductInterestSearchResult,
  OccConfig,
  ImageType,
  UserInterestsService,
  ProductInterestEntryRelation,
  NotificationType,
  ProductService,
  Product,
} from '@spartacus/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ListNavigationModule } from '../../../shared/components/list-navigation/list-navigation.module';
import { By } from '@angular/platform-browser';
import { ICON_TYPE } from '../../misc/icon/icon.model';
import { cold, getTestScheduler } from 'jasmine-marbles';

@Component({
  template: '',
  selector: 'cx-media',
})
class MockMediaComponent {
  @Input() container;
  @Input() format;
}

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
    media: {
      baseUrl: '',
    },
  },
};
const MockLayoutConfig: LayoutConfig = {};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {}
}

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockSpinnerComponent {}

const p553637: Product = {
  code: '553637',
  name: 'NV10',
  images: {
    PRIMARY: {
      thumbnail: {
        altText: 'NV10',
        format: 'thumbnail',
        imageType: ImageType.PRIMARY,
        url: 'image-url',
      },
    },
  },
  price: {
    formattedValue: '$264.69',
  },
  stock: {
    stockLevel: 0,
    stockLevelStatus: 'outOfStock',
  },
};

const p553638: Product = {
  code: '553638',
  name: 'NV11',
  images: {
    PRIMARY: {
      thumbnail: {
        altText: 'NV11',
        format: 'thumbnail',
        imageType: ImageType.PRIMARY,
        url: 'image-url',
      },
    },
  },
  price: {
    formattedValue: '$188.69',
  },
  stock: {
    stockLevel: 0,
    stockLevelStatus: 'outOfStock',
  },
  baseOptions: [
    {
      selected: {
        variantOptionQualifiers: [
          {
            name: 'color',
            value: 'red',
          },
          {
            name: 'size',
            value: 'XL',
          },
        ],
      },
    },
  ],
};

const mockedInterests: ProductInterestSearchResult = {
  sorts: [{ code: 'name', asc: true }],
  pagination: {
    count: 5,
    page: 0,
    totalCount: 1,
    totalPages: 1,
  },
  results: [
    {
      product: {
        code: '553637',
      },
      productInterestEntry: [
        {
          dateAdded: new Date().toString(),
          interestType: NotificationType.BACK_IN_STOCK,
        },
      ],
    },
    {
      product: {
        code: '553638',
      },
      productInterestEntry: [
        {
          dateAdded: new Date().toString(),
          interestType: NotificationType.BACK_IN_STOCK,
        },
      ],
    },
  ],
};
const emptyInterests: ProductInterestSearchResult = {
  sorts: [{ code: 'name', asc: true }],
  pagination: {},
};

describe('MyInterestsComponent', () => {
  let component: MyInterestsComponent;
  let fixture: ComponentFixture<MyInterestsComponent>;
  let el: DebugElement;

  const productInterestService = jasmine.createSpyObj('UserInterestsService', [
    'loadProductInterests',
    'getAndLoadProductInterests',
    'getProdutInterestsLoading',
    'getRemoveProdutInterestLoading',
    'removeProdutInterest',
    'clearProductInterests',
    'resetRemoveInterestState',
  ]);
  const productService = jasmine.createSpyObj('ProductService', ['get']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ListNavigationModule, I18nTestingModule],
      providers: [
        { provide: OccConfig, useValue: MockOccModuleConfig },
        { provide: LayoutConfig, useValue: MockLayoutConfig },
        { provide: UserInterestsService, useValue: productInterestService },
        { provide: ProductService, useValue: productService },
      ],
      declarations: [
        MyInterestsComponent,
        MockUrlPipe,
        MockMediaComponent,
        MockCxIconComponent,
        MockSpinnerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInterestsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    productInterestService.getAndLoadProductInterests.and.returnValue(
      of(emptyInterests)
    );
    productInterestService.getProdutInterestsLoading.and.returnValue(of(false));
    productInterestService.getRemoveProdutInterestLoading.and.returnValue(
      of(false)
    );
    productInterestService.loadProductInterests.and.stub();
    productInterestService.removeProdutInterest.and.stub();
    productInterestService.clearProductInterests.and.stub();
    productInterestService.resetRemoveInterestState.and.stub();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when data is loading', () => {
    productInterestService.getProdutInterestsLoading.and.returnValue(of(true));
    fixture.detectChanges();
    expect(el.query(By.css('cx-spinner'))).toBeTruthy();
  });

  it('should display message when no interest', () => {
    fixture.detectChanges();
    expect(el.query(By.css('.cx-product-interests-message'))).toBeTruthy();
  });

  it('should show interests list', () => {
    productInterestService.getAndLoadProductInterests.and.returnValue(
      of(mockedInterests)
    );
    productService.get
      .withArgs('553637', 'productInterests')
      .and.returnValue(of(p553637));
    productService.get
      .withArgs('553638', 'productInterests')
      .and.returnValue(of(p553638));
    productInterestService.getProdutInterestsLoading.and.returnValue(of(false));
    fixture.detectChanges();

    expect(el.queryAll(By.css('.cx-product-interests-title')).length).toEqual(
      1
    );
    expect(el.queryAll(By.css('cx-sorting')).length).toEqual(2);
    expect(el.queryAll(By.css('cx-pagination')).length).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-product-item')).length
    ).toEqual(2);
    expect(el.queryAll(By.css('cx-media')).length).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-product-image-link')).length
    ).toEqual(2);
    expect(el.queryAll(By.css('.cx-name')).length).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-product-code-link')).length
    ).toEqual(2);
    expect(el.queryAll(By.css('.cx-code')).length).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-variant-name')).length
    ).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-variant-value')).length
    ).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-product-stock')).length
    ).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-product-price')).length
    ).toEqual(2);
    expect(el.queryAll(By.css('.cx-product-interests-type')).length).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-expiration-date')).length
    ).toEqual(2);
    expect(
      el.queryAll(By.css('.cx-product-interests-remove-btn')).length
    ).toEqual(2);
  });

  it('should be able to change page/sort', () => {
    fixture.detectChanges();

    component.sortChange('byNameAsc');
    expect(productInterestService.loadProductInterests).toHaveBeenCalledWith(
      10,
      0,
      'name:asc'
    );

    component.pageChange(2);
    expect(productInterestService.loadProductInterests).toHaveBeenCalledWith(
      10,
      2,
      'name:asc'
    );
  });

  it('should be able to remove an interest item', () => {
    productInterestService.getAndLoadProductInterests.and.returnValue(
      of(mockedInterests)
    );
    productService.get
      .withArgs('553637', 'productInterests')
      .and.returnValue(of(p553637));
    productService.get
      .withArgs('553638', 'productInterests')
      .and.returnValue(of(p553638));
    productInterestService.getRemoveProdutInterestLoading.and.returnValue(
      cold('-a|', { a: true })
    );
    fixture.detectChanges();
    const button = el.query(By.css('.cx-product-interests-remove-btn'))
      .nativeElement;
    expect(button.disabled).toBeFalsy();

    button.click();
    getTestScheduler().flush();
    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();
    const item: ProductInterestEntryRelation = mockedInterests.results[0];
    expect(productInterestService.removeProdutInterest).toHaveBeenCalledWith(
      item
    );
  });
});
