import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import {
  StoreFinderSearchPage,
  StoreFinderService,
} from '@spartacus/storefinder/core';
import { forkJoin, Observable, of } from 'rxjs';

import { Customer360SectionContextSource } from '../customer-360-section-context-source.model';
import { Customer360SectionContext } from '../customer-360-section-context.model';

import { AsmCustomerMapComponent } from './asm-customer-map.component';

describe('AsmCustomerMapComponent', () => {
  const stores = [
    {
      displayName: 'Boston',
      address: {
        line1: '53 State St',
        line2: 'Floor 16',
        postalCode: '02109',
      },
      geoPoint: {
        latitude: 42.3586851,
        longitude: -71.0562295,
      },
      features: {
        'wheelchair-accessible': 'Wheelchair accessible',
      },
      openingHours: {
        weekDayOpeningList: [
          {
            closed: true,
            weekDay: 'Sat - Sun',
          },
          {
            weekDay: 'Mon - Thurs',
            openingTime: {
              formattedHour: '9:00AM',
            },
            closingTime: {
              formattedHour: '5:00PM',
            },
          },
          {
            weekDay: 'Fri',
            openingTime: {
              formattedHour: '12:00AM',
            },
          },
        ],
      },
    },
    {
      displayName: 'New York',
      address: {
        line1: '10 Hudson Yards',
        line2: 'Floor 52',
        postalCode: '10001',
      },
      geoPoint: {
        latitude: 40.7527064,
        longitude: -74.0032874,
      },
      features: {
        'wheelchair-accessible': 'Wheelchair accessible',
      },
      openingHours: {
        weekDayOpeningList: [
          {
            closed: true,
            weekDay: 'Sun',
          },
          {
            weekDay: 'Mon - Sat',
            openingTime: {
              formattedHour: '9:00 AM',
            },
            closingTime: {
              formattedHour: '5:00PM',
            },
          },
        ],
      },
    },
  ];

  class MockStoreFinderService {
    findStoresAction(): void {}

    getFindStoresEntities(): Observable<StoreFinderSearchPage> {
      return of({
        pagination: {
          currentPage: 1,
          pageSize: 1,
          totalPages: 2,
        },
        stores,
      });
    }
  }

  let component: AsmCustomerMapComponent;
  let fixture: ComponentFixture<AsmCustomerMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [AsmCustomerMapComponent],
      providers: [
        Customer360SectionContextSource,
        {
          provide: Customer360SectionContext,
          useExisting: Customer360SectionContextSource,
        },
        { provide: StoreFinderService, useClass: MockStoreFinderService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const contextSource = TestBed.inject(Customer360SectionContextSource);

    contextSource.config$.next({
      googleMapsApiKey: 'foo',
      storefinderRadius: 1000,
    });

    contextSource.data$.next({
      address: 'Boston',
    });

    fixture = TestBed.createComponent(AsmCustomerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized with store data', () => {
    expect(component.storeData.pagination).toEqual({
      currentPage: 1,
      pageSize: 1,
      totalPages: 2,
    });
    expect(component.selectedStore.displayName).toBe('Boston');
    expect(component.googleMapsUrl).toBeTruthy();
  });

  it('should select a store', () => {
    component.selectStore(stores[1]);

    expect(component.selectedStore.displayName).toBe('New York');
    expect(component.googleMapsUrl).toBeTruthy();
  });

  it('should parse store openings into strings', (done) => {
    const [closed, open, openWithNoClose] =
      stores[0].openingHours.weekDayOpeningList;

    forkJoin([
      component.getStoreOpening(closed),
      component.getStoreOpening(open),
      component.getStoreOpening(openWithNoClose),
    ]).subscribe(([str1, str2, str3]) => {
      expect(str1).toBe('asm.customer360.maps.storeClosed');
      expect(str2).toBe('9:00AM - 5:00PM');
      expect(str3).toBe('12:00AM');

      done();
    });
  });
});
