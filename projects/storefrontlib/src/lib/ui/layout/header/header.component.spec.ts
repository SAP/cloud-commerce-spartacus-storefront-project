import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import * as fromAuth from '../../../auth/store';
import {
  DynamicSlotComponent,
  ComponentWrapperDirective
} from '../../../cms/components';
import * as fromCmsReducer from '../../../cms/store/reducers';
import { MaterialModule } from '../../../material.module';
import * as fromRoot from '../../../routing/store';
import { SiteContextModuleConfig } from '../../../site-context/site-context-module-config';
import { CurrencySelectorComponent } from '../../../site-context/currency-selector/currency-selector.component';
import { LanguageSelectorComponent } from '../../../site-context/language-selector/language-selector.component';
import * as fromUserReducer from '../../../user/store/reducers';
import * as fromSCStore from './../../../site-context/shared/store';
import { LoginComponent } from './../../../user/components/login/login.component';
import { HeaderSkipperComponent } from './header-skipper/header-skipper.component';
import { HeaderComponent } from './header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { TertiaryBarComponent } from './tertiary-bar/tertiary-bar.component';

class MockSiteContextModuleConfig {
  site = {
    language: 'de',
    currency: 'JPY'
  };
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          user: combineReducers(fromUserReducer.getReducers()),
          siteContext: combineReducers(fromSCStore.getReducers()),
          cms: combineReducers(fromCmsReducer.getReducers()),
          auth: combineReducers(fromAuth.getReducers())
        })
      ],
      declarations: [
        HeaderComponent,
        DynamicSlotComponent,
        ComponentWrapperDirective,
        CurrencySelectorComponent,
        LanguageSelectorComponent,
        HeaderSkipperComponent,
        TertiaryBarComponent,
        MobileMenuComponent,
        LoginComponent
      ],
      providers: [
        {
          provide: SiteContextModuleConfig,
          useClass: MockSiteContextModuleConfig
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // UI TEST
  describe('UI tests', () => {
    it('should contain the header skipper component', () => {
      expect(
        fixture.debugElement.query(By.css('y-header-skipper'))
      ).not.toBeNull();
    });

    it('should contain the Site Context Selectors', () => {
      expect(
        fixture.debugElement.query(
          By.css('div.y-content__slot:not(#y-mobile-menu) y-language-selector')
        )
      ).not.toBeNull();

      expect(
        fixture.debugElement.query(
          By.css('div.y-content__slot:not(#y-mobile-menu) y-currency-selector')
        )
      ).not.toBeNull();
    });

    it('should contain the tertiary-bar component', () => {
      expect(
        fixture.debugElement.query(By.css('y-tertiary-bar'))
      ).not.toBeNull();
    });

    it('should contain the login status component', () => {
      expect(
        fixture.debugElement.query(
          By.css('div.y-content__slot:not(#y-mobile-menu) y-login')
        )
      ).not.toBeNull();
    });

    it('should contain the mobile menu component', () => {
      expect(
        fixture.debugElement.query(By.css('y-mobile-menu'))
      ).not.toBeNull();
    });

    describe('Dynamic slots', () => {
      it('should contain site logo', () => {
        expect(
          fixture.debugElement.query(
            By.css('y-dynamic-slot[position="SiteLogo"]')
          )
        ).not.toBeNull();
      });

      it('should contain the searchbox', () => {
        expect(
          fixture.debugElement.query(
            By.css('y-dynamic-slot[position="SearchBox"]')
          )
        ).not.toBeNull();
      });

      it('should contain the mini cart', () => {
        expect(
          fixture.debugElement.query(
            By.css('y-dynamic-slot[position="MiniCart"]')
          )
        ).not.toBeNull();
      });

      it('should contain the navigation bar', () => {
        expect(
          fixture.debugElement.query(
            By.css(
              'div.y-content__slot:not(#y-mobile-menu) y-dynamic-slot[position="NavigationBar"]'
            )
          )
        ).not.toBeNull();
      });
    });
  });
});
