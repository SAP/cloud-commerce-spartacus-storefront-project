import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CMS_PAGE_NORMALIZER } from '../../../cms/connectors';
import { CmsStructureConfigService } from '../../../cms/services';
import { CmsComponent, PageType } from '../../../model/cms.model';
import { HOME_PAGE_ID, PageContext } from '../../../routing';
import { ConverterService } from '../../../util/converter.service';
import { OccEndpointsService } from '../../services/occ-endpoints.service';
import { OccCmsPageAdapter } from './occ-cms-page.adapter';
import createSpy = jasmine.createSpy;

const components: CmsComponent[] = [
  { uid: 'comp1', typeCode: 'SimpleBannerComponent' },
  { uid: 'comp2', typeCode: 'CMSLinkComponent' },
  { uid: 'comp3', typeCode: 'NavigationComponent' },
];

const cmsPageData: any = {
  uid: 'testPageId',
  name: 'testPage',
  template: 'testTemplate',
  contentSlots: {
    contentSlot: [
      { components: { component: components }, position: 'testPosition' },
    ],
  },
};

class CmsStructureConfigServiceMock {}

const endpoint = '/cms';

class OccEndpointsServiceMock {
  getEndpoint(): string {
    return endpoint;
  }
  getUrl(_endpoint: string, _urlParams?: any, _queryParams?: any): string {
    return '';
  }
}

class MockConverterService {
  pipeable = createSpy().and.returnValue((x) => x);
}

const homePageContext: PageContext = {
  id: HOME_PAGE_ID,
  type: PageType.CONTENT_PAGE,
};

const context: PageContext = {
  id: 'testPagId',
  type: PageType.CONTENT_PAGE,
};

const context1: PageContext = {
  id: '123',
  type: PageType.PRODUCT_PAGE,
};

describe('OccCmsPageAdapter', () => {
  let service: OccCmsPageAdapter;
  let httpMock: HttpTestingController;
  let endpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccCmsPageAdapter,
        { provide: OccEndpointsService, useClass: OccEndpointsServiceMock },
        {
          provide: CmsStructureConfigService,
          useClass: CmsStructureConfigServiceMock,
        },
        { provide: ConverterService, useClass: MockConverterService },
      ],
    });
    service = TestBed.inject(OccCmsPageAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    endpointsService = TestBed.inject(OccEndpointsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Load cms page data', () => {
    it('Should get cms content page data without parameter fields', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/pages?pageType=${context.type}&pageLabelOrId=${context.id}`
      );

      service.load(context).subscribe((result) => {
        expect(result).toEqual(cmsPageData);
      });

      const testRequest = httpMock.expectOne((req) => {
        return (
          req.method === 'GET' &&
          req.url ===
            endpoint +
              `/pages?pageType=${context.type}&pageLabelOrId=${context.id}`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'pages',
        {},
        { pageType: context.type, pageLabelOrId: context.id }
      );
      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(cmsPageData);
    });

    it('Should get cms content page data with parameter fields', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint +
          `/pages?fields=BASIC&pageType=${context.type}&pageLabelOrId=${context.id}`
      );

      service.load(context, 'BASIC').subscribe((result) => {
        expect(result).toEqual(cmsPageData);
      });

      const testRequest = httpMock.expectOne((req) => {
        return (
          req.method === 'GET' &&
          req.url ===
            endpoint +
              `/pages?fields=BASIC&pageType=${context.type}&pageLabelOrId=${context.id}`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'pages',
        {},
        { fields: 'BASIC', pageType: context.type, pageLabelOrId: context.id }
      );
      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(cmsPageData);
    });

    it('Should get home page data without parameters', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(endpoint + `/pages`);

      service.load(homePageContext).subscribe((result) => {
        expect(result).toEqual(cmsPageData);
      });

      const testRequest = httpMock.expectOne((req) => {
        return req.method === 'GET' && req.url === endpoint + `/pages`;
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith('pages', {}, {});
      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(cmsPageData);
    });

    it('should get cms product page data', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/pages?pageType=${context1.type}&code=${context1.id}`
      );
      service.load(context1).subscribe((result) => {
        expect(result).toEqual(cmsPageData);
      });

      const testRequest = httpMock.expectOne((req) => {
        return (
          req.method === 'GET' &&
          req.url ===
            endpoint + `/pages?pageType=${context1.type}&code=${context1.id}`
        );
      });

      expect(endpointsService.getUrl).toHaveBeenCalledWith(
        'pages',
        {},
        { pageType: context1.type, code: context1.id }
      );
      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(cmsPageData);
    });

    it('should get cms page data by pageId if PageType is unknown', () => {
      const contextWithoutType: PageContext = {
        id: '123',
      };
      spyOn(endpointsService, 'getUrl').and.returnValue(
        endpoint + `/pages/${contextWithoutType.id}`
      );
      service.load(contextWithoutType).subscribe((result) => {
        expect(result).toEqual(cmsPageData);
      });

      const testRequest = httpMock.expectOne((req) => {
        return req.method === 'GET' && req.url === endpoint + '/pages/123';
      });

      expect(testRequest.cancelled).toBeFalsy();
      expect(testRequest.request.responseType).toEqual('json');
      testRequest.flush(cmsPageData);
    });

    it('should use normalizer', () => {
      spyOn(endpointsService, 'getUrl').and.returnValue(endpoint + '/pages');
      const converter = TestBed.inject(ConverterService);

      service.load(context).subscribe();

      httpMock
        .expectOne((req) => req.url === endpoint + '/pages')
        .flush(cmsPageData);

      expect(converter.pipeable).toHaveBeenCalledWith(CMS_PAGE_NORMALIZER);
    });
  });
});
