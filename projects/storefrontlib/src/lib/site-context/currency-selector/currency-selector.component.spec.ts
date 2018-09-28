import { By } from '@angular/platform-browser';
import { DebugElement, ChangeDetectionStrategy } from '@angular/core';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectorComponent } from './currency-selector.component';
import * as fromStore from './../shared/store';
import * as fromRoot from './../../routing/store';

import * as fromActions from './../shared/store/actions/currencies.action';
import { PageType } from '../../routing/models/page-context.model';
import { of } from 'rxjs';
import { SiteContextModuleConfig } from '../site-context-module-config';

const MockSiteContextModuleConfig: SiteContextModuleConfig = {
  site: {
    language: 'de',
    currency: 'JPY'
  }
};

describe('CurrencySelectorComponent', () => {
  const currencies: any[] = [
    { active: false, isocode: 'USD', name: 'US Dollar', symbol: '$' }
  ];

  let component: CurrencySelectorComponent;
  let fixture: ComponentFixture<CurrencySelectorComponent>;
  let store: Store<fromStore.SiteContextState>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          siteContext: combineReducers(fromStore.getReducers())
        })
      ],
      declarations: [CurrencySelectorComponent],
      providers: [
        {
          provide: SiteContextModuleConfig,
          useValue: MockSiteContextModuleConfig
        }
      ]
    })
      .overrideComponent(CurrencySelectorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectorComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain dropdown with currencies', () => {
    component.currencies$ = of(currencies);

    const label = el.query(By.css('label'));
    const select = el.query(By.css('select'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(select.nativeElement.value).toEqual(currencies[0].isocode);
    });

    expect(label.nativeElement.textContent).toEqual('Currency');
  });

  it('should contain disabled dropdown when currencies list is empty', () => {
    component.currencies$ = of([]);
    const select = el.query(By.css('select'));
    fixture.detectChanges();

    expect(select.nativeElement.disabled).toBeTruthy();
  });

  it('should contain enabled dropdown when currencies list is NOT empty', () => {
    component.currencies$ = of(currencies);
    const select = el.query(By.css('select'));
    fixture.detectChanges();

    expect(select.nativeElement.disabled).toBeFalsy();
  });

  it('should get currency data', () => {
    const action = new fromActions.LoadCurrenciesSuccess(currencies);
    store.dispatch(action);

    store.select(fromStore.getAllCurrencies).subscribe(data => {
      expect(data).toEqual(currencies);
    });
  });

  it('should change currency', () => {
    const pageContext = { id: 'testPageId', type: PageType.CONTENT_PAGE };
    store.dispatch({
      type: 'ROUTER_NAVIGATION',
      payload: {
        routerState: {
          context: pageContext
        },
        event: {}
      }
    });

    const usdCurrency = 'USD';
    component.setActiveCurrency(usdCurrency);
    expect(component.activeCurrency).toEqual(usdCurrency);

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromActions.SetActiveCurrency(usdCurrency)
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromActions.CurrencyChange()
    );
  });
});
