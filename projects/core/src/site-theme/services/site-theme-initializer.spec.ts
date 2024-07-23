import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ConfigInitializerService } from '../../config';
import createSpy = jasmine.createSpy;
import { SiteThemeConfig } from '../config/site-theme-config';
import { SiteThemeService } from '../facade';
import { SiteThemeInitializer } from './site-theme-initializer';
import { SiteThemePersistenceService } from './site-theme-persistence.service';

const mockSiteThemeConfig: SiteThemeConfig = {
  siteTheme: {
    themes: [{ i18nNameKey: 'dark', className: 'dark', default: true }],
  },
};

class MockSiteThemeService implements Partial<SiteThemeService> {
  isInitialized() {
    return false;
  }
  setActive = createSpy().and.stub();
}

class MockSiteThemePersistenceService
  implements Partial<SiteThemePersistenceService>
{
  initSync = createSpy().and.returnValue(of(EMPTY));
}

class MockConfigInitializerService
  implements Partial<ConfigInitializerService>
{
  getStable = () => of(mockSiteThemeConfig);
}

describe('SiteThemeInitializer', () => {
  let initializer: SiteThemeInitializer;
  let siteThemeService: SiteThemeService;
  let siteThemePersistenceService: SiteThemePersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteThemeInitializer,
        { provide: SiteThemeService, useClass: MockSiteThemeService },
        {
          provide: SiteThemePersistenceService,
          useClass: MockSiteThemePersistenceService,
        },
        {
          provide: ConfigInitializerService,
          useClass: MockConfigInitializerService,
        },
      ],
    });

    siteThemePersistenceService = TestBed.inject(SiteThemePersistenceService);
    siteThemeService = TestBed.inject(SiteThemeService);
    initializer = TestBed.inject(SiteThemeInitializer);
  });

  it('should be created', () => {
    expect(initializer).toBeTruthy();
  });

  describe('initialize', () => {
    it('should call SiteThemePersistenceService initSync()', () => {
      spyOn<any>(initializer, 'setFallbackValue').and.returnValue(of(null));
      initializer.initialize();
      expect(siteThemePersistenceService.initSync).toHaveBeenCalled();
      expect(initializer['setFallbackValue']).toHaveBeenCalled();
    });

    it('should set default from config is the theme is NOT initialized', () => {
      initializer.initialize();
      expect(siteThemeService.setActive).toHaveBeenCalledWith('dark');
    });

    it('should NOT set default from config is the theme is initialized', () => {
      spyOn(siteThemeService, 'isInitialized').and.returnValue(true);
      initializer.initialize();
      expect(siteThemeService.setActive).not.toHaveBeenCalled();
    });
  });
});
