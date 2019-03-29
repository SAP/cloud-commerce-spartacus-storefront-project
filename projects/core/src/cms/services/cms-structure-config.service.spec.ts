import { TestBed } from '@angular/core/testing';
import {
  CmsPageConfig,
  CmsStructureConfig,
  CmsStructureConfigService,
  CmsStructureModel
} from '@spartacus/core';

let mockPageStructure: CmsStructureModel;

describe('CmsStructureConfigService', () => {
  describe('Without configuration', () => {
    let service: CmsStructureConfigService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [CmsStructureConfigService, CmsStructureConfig]
      });

      mockPageStructure = {
        page: {
          pageId: 'mockPage',
          slots: {}
        }
      };

      service = TestBed.get(CmsStructureConfigService);
    });

    it('should CmsStructureConfigService is injected', () => {
      expect(service).toBeTruthy();
    });

    it('should return page as-is', () => {
      let result: CmsStructureModel;
      service
        .mergePageStructure('mockPage', mockPageStructure)
        .subscribe(res => {
          result = res;
        });

      expect(result).toEqual(mockPageStructure);
    });
  });

  describe('With configuration added', () => {
    let service: CmsStructureConfigService;

    const cartPageConfig: CmsPageConfig = {
      pageId: 'cartPage',
      slots: {
        EmptyCartMiddleContent: {
          componentIds: ['CMSParagraphComponent']
        }
      }
    };

    const ingoredPageConfig: CmsPageConfig = {
      ignoreBackend: true,
      pageId: 'customPage',
      slots: {}
    };

    const pageWithGobalSlotConfig: CmsPageConfig = {
      ignoreBackend: true,
      pageId: 'hasGobalSlot',
      slots: {
        GobalSlot: {}
      }
    };

    const globalSlotConfig: CmsStructureConfig = {
      cmsStructure: {
        components: {
          CMSLinkComponent: {
            flexType: 'CMSLinkComponent',
            typeCode: 'CMSLinkComponent'
          }
        },
        slots: {
          GobalSlot: {
            componentIds: ['CMSLinkComponent']
          }
        },
        pages: [cartPageConfig, ingoredPageConfig, pageWithGobalSlotConfig]
      }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          CmsStructureConfigService,
          {
            provide: CmsStructureConfig,
            useValue: globalSlotConfig
          }
        ]
      });

      mockPageStructure = {
        page: {
          pageId: 'mockPage',
          slots: {}
        }
      };

      service = TestBed.get(CmsStructureConfigService);
    });

    it('should CmsStructureConfigService is injected', () => {
      expect(service).toBeTruthy();
    });

    it('should merge global slots and page slots', () => {
      let result: CmsStructureModel;
      service
        .mergePageStructure('cartPage', mockPageStructure)
        .subscribe(res => {
          result = res;
        });

      expect(Object.keys(result.page.slots)).toContain(
        'EmptyCartMiddleContent'
      );
      expect(Object.keys(result.page.slots)).toContain('GobalSlot');
      expect(Object.keys(result.page.slots).length).toEqual(2);
    });

    it('should add global slots to empty page', () => {
      let result: CmsStructureModel;
      service
        .mergePageStructure('nonExistingPage', mockPageStructure)
        .subscribe(res => (result = res));

      expect(Object.keys(result.page.slots)).toContain('GobalSlot');
      expect(Object.keys(result.page.slots).length).toEqual(1);
    });

    it('should not add global slots if slots are allready defined by page', () => {
      let result: CmsStructureModel;
      service
        .mergePageStructure('hasGobalSlot', mockPageStructure)
        .subscribe(res => (result = res));

      expect(Object.keys(result.page.slots['GobalSlot'])).not.toContain(
        'components'
      );
    });

    it('should return true for configuration with ignoreBackend set to true', () => {
      let result;
      service.shouldIgnoreBackend('cartPage').subscribe(res => (result = res));
      expect(result).toEqual(false);
    });

    it('should return true for configuration with ignoreBackend set to false', () => {
      let result;
      service
        .shouldIgnoreBackend('customPage')
        .subscribe(res => (result = res));
      expect(result).toEqual(true);
    });
  });
});
