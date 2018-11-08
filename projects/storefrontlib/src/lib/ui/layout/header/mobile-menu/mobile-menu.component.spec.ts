import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromAuth from '../../../../auth/store';
import * as fromCms from '../../../../cms/store';
import * as fromUser from '../../../../user/store';
import { CmsModule } from './../../../../cms/cms.module';
import { LoginModule } from './../../../../user/components/login/login.module';
import { MobileMenuComponent } from './mobile-menu.component';
import { By } from '@angular/platform-browser';
import { CmsModuleConfig } from '../../../../cms/cms-module-config';
import { PwaModule } from 'projects/storefrontlib/src/lib/pwa/pwa.module';
import {
  PWAModuleConfig,
  defaultPWAModuleConfig
} from 'projects/storefrontlib/src/lib/pwa/pwa.module-config';
import { SiteContextConfig } from '@spartacus/core';
import { SiteContextModule } from '../../../../site-context';

describe('MobileMenuComponent', () => {
  let component: MobileMenuComponent;
  let fixture: ComponentFixture<MobileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        CmsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('user', fromUser.getReducers()),
        StoreModule.forFeature('auth', fromAuth.getReducers()),
        EffectsModule.forRoot(fromCms.effects),
        PwaModule,
        SiteContextModule
      ],
      declarations: [MobileMenuComponent],
      providers: [
        provideMockActions(() => of()),
        fromCms.NavigationEntryItemEffects,
        {
          provide: CmsModuleConfig,
          useValue: { site: 'en' }
        },
        {
          provide: SiteContextConfig,
          useExisting: CmsModuleConfig
        },
        {
          provide: PWAModuleConfig,
          useValue: defaultPWAModuleConfig
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI tests', () => {
    it('should contain the hamburger', () => {
      expect(
        fixture.debugElement.query(By.css('button.hamburger'))
      ).not.toBeNull();
    });

    it('should contain the login status component', () => {
      expect(fixture.debugElement.query(By.css('cx-login'))).not.toBeNull();
    });

    it('should contain the Site Context components', () => {
      expect(
        fixture.debugElement.query(By.css('cx-language-selector'))
      ).not.toBeNull();
      expect(
        fixture.debugElement.query(By.css('cx-currency-selector'))
      ).not.toBeNull();
    });

    describe('Dynamic slots', () => {
      it('should contain the NavigationBar', () => {
        expect(
          fixture.debugElement.query(
            By.css('cx-dynamic-slot[position="NavigationBar"]')
          )
        ).not.toBeNull();
      });
    });

    describe('toggleMenu', () => {
      it('should open or close menu', () => {
        component.showMenu = false;
        component.toggleMenu();

        expect(component.showMenu).toBe(true);

        component.toggleMenu();
        expect(component.showMenu).toBe(false);
      });
    });
  });
});
