import { TestBed } from '@angular/core/testing';
import { ConverterService, LanguageService } from '@spartacus/core';
import { UserProfileFacade } from '@spartacus/user/profile/root';
import { of } from 'rxjs';
import { CdcUserConsentService } from './cdc-user-consent.service';
import { CdcConsentsLocalStorageService } from './cdc-consents-local-storage.service';
import createSpy = jasmine.createSpy;
import { CdcJsService } from '@spartacus/cdc/root';
import { CdcSiteConsentTemplate } from '../../core/models/cdc-site-consents.model';
const mockUser = { uid: 'sampleuser@mail.com' };
const mockCdcSiteConsents: CdcSiteConsentTemplate = {
  siteConsentDetails: {
    'terms.of.use': {},
    'privacy.statement': {},
    'consent.survey': {},
  },
};
const mockStoredConsents: string[] = [
  'terms.of.use',
  'privacy.statement',
  'consent.survey',
];
const mockCdcSdkOutput = {
  errorCode: 0,
  errorMessage: '',
  time: new Date('3 march 2023'),
};
class MockUserProfileFacade implements Partial<UserProfileFacade> {
  get = createSpy();
}
class MockLanguageService implements Partial<LanguageService> {
  getActive = createSpy();
}
class MockCdcJsService implements Partial<CdcJsService> {
  getUserConsentPreferences = createSpy();
  setUserConsentPreferences = createSpy();
}
class MockCdcConsentsLocalStorageService
  implements Partial<CdcConsentsLocalStorageService>
{
  checkIfConsentExists = createSpy();
}
class MockConverterService implements Partial<ConverterService> {
  convert = createSpy();
}
describe('CdcUserConsentConnector', () => {
  let service: CdcUserConsentService;
  let userProfileFacade: UserProfileFacade;
  let languageService: LanguageService;
  let cdcJsService: CdcJsService;
  let converter: ConverterService;
  let cdcConsentStorage: CdcConsentsLocalStorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserProfileFacade,
          useClass: MockUserProfileFacade,
        },
        {
          provide: LanguageService,
          useClass: MockLanguageService,
        },
        {
          provide: CdcJsService,
          useClass: MockCdcJsService,
        },
        {
          provide: CdcConsentsLocalStorageService,
          useClass: MockCdcConsentsLocalStorageService,
        },
        {
          provide: ConverterService,
          useClass: MockConverterService,
        },
      ],
    });
    service = TestBed.inject(CdcUserConsentService);
    userProfileFacade = TestBed.inject(UserProfileFacade);
    languageService = TestBed.inject(LanguageService);
    cdcJsService = TestBed.inject(CdcJsService);
    converter = TestBed.inject(ConverterService);
    cdcConsentStorage = TestBed.inject(CdcConsentsLocalStorageService);
    TestBed.compileComponents();
  });
  it('should create service', () => {
    expect(service).toBeTruthy();
  });
  describe('getUserID()', () => {
    it('get logged in user id', () => {
      userProfileFacade.get = createSpy().and.returnValue(of(mockUser));
      let output = service.getUserID();
      expect(userProfileFacade.get).toHaveBeenCalled();
      expect(output).toEqual('sampleuser@mail.com');
    });
  });
  describe('getActiveLanguage()', () => {
    it('get active language', () => {
      languageService.getActive = createSpy().and.returnValue(of('en'));
      let output = service.getActiveLanguage();
      expect(languageService.getActive).toHaveBeenCalled();
      expect(output).toEqual('en');
    });
  });
  describe('updateCdcConsent()', () => {
    it('give consent via CDC SDK', () => {
      languageService.getActive = createSpy().and.returnValue(of('en'));
      userProfileFacade.get = createSpy().and.returnValue(of(mockUser));
      converter.convert = createSpy().and.returnValue({
        others: {
          survey: {
            isConsentGranted: true,
          },
        },
      });
      cdcJsService.setUserConsentPreferences = createSpy().and.returnValue(
        of(mockCdcSdkOutput)
      );
      service.updateCdcConsent(true, 'others.survey');
      expect(cdcJsService.setUserConsentPreferences).toHaveBeenCalledWith(
        'sampleuser@mail.com',
        'en',
        {
          others: {
            survey: {
              isConsentGranted: true,
            },
          },
        }
      );
    });
    it('withdraw consent via CDC SDK', () => {
      languageService.getActive = createSpy().and.returnValue(of('en'));
      userProfileFacade.get = createSpy().and.returnValue(of(mockUser));
      converter.convert = createSpy().and.returnValue({
        others: {
          survey: {
            isConsentGranted: false,
          },
        },
      });
      cdcJsService.setUserConsentPreferences = createSpy().and.returnValue(
        of(mockCdcSdkOutput)
      );
      service.updateCdcConsent(false, 'others.survey');
      expect(cdcJsService.setUserConsentPreferences).toHaveBeenCalledWith(
        'sampleuser@mail.com',
        'en',
        {
          others: {
            survey: {
              isConsentGranted: false,
            },
          },
        }
      );
    });
    it('should return immediately without proceeding further for non-CDC consents', () => {
      cdcConsentStorage.checkIfConsentExists =
        createSpy().and.returnValue(false);
      service.updateCdcConsent(false, 'others.survey');
      expect(cdcJsService.setUserConsentPreferences).not.toHaveBeenCalled();
      expect(languageService.getActive).not.toHaveBeenCalled();
      expect(userProfileFacade.get).not.toHaveBeenCalled();
    });
  });
  describe('persistCdcSiteConsents()', () => {
    it('should persist cdc site consents into local storage', () => {
      cdcJsService.getSiteConsentDetails = createSpy().and.returnValue(
        of(mockCdcSiteConsents)
      );
      service.persistCdcSiteConsents();
      expect(cdcJsService.getSiteConsentDetails).toHaveBeenCalled();
      expect(cdcConsentStorage.syncCdcConsentsState).toHaveBeenCalledWith(
        mockStoredConsents
      );
    });
  });
});
