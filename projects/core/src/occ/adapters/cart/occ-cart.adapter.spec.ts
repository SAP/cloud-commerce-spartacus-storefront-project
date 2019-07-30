import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cart } from '../../../model/cart.model';
import { ProductImageNormalizer } from '../../../occ/adapters/product/converters/index';
import { ConverterService } from '../../../util/converter.service';
import { Occ } from '../../occ-models/occ.models';
import { OccEndpointsService } from '../../services';
import { OccCartAdapter } from './occ-cart.adapter';

const userId = '123';
const cartId = '456';
const toMergeCart = { guid: '123456' };
const cartData: Occ.Cart = {
  store: 'electronics',
  guid: '1212121',
};
const cartDataList: Occ.CartList = {
  carts: [cartData],
};
const mergedCart: Cart = {
  name: 'mergedCart',
};

class MockOccEndpointsService {
  getUrl(endpoint: string, _urlParams?: object, _queryParams?: object) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(url: string) {
    return url;
  }
}

describe('OccCartAdapter', () => {
  let service: OccCartAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEndpointService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccCartAdapter,
        ProductImageNormalizer,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
      ],
    });

    service = TestBed.get(OccCartAdapter);
    httpMock = TestBed.get(HttpTestingController);
    converter = TestBed.get(ConverterService);
    occEndpointService = TestBed.get(OccEndpointsService);

    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'pipeableMany').and.callThrough();
    spyOn(occEndpointService, 'getUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load all carts', () => {
    it('should load all carts details data for given user with details flag', () => {
      let result;
      service.loadAll(userId).subscribe(res => (result = res));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === 'carts';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.getUrl).toHaveBeenCalledWith('carts', {
        userId,
      });
      mockReq.flush(cartDataList);
      expect(result).toEqual(cartDataList.carts);
    });
  });

  describe('load cart data', () => {
    it('should load cart detail data for given userId, cartId', () => {
      let result;
      service.load(userId, cartId).subscribe(res => (result = res));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === 'cart';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.getUrl).toHaveBeenCalledWith('cart', {
        userId,
        cartId,
      });
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });

    it('should load current cart for given userId', () => {
      let result;
      service.load(userId, 'current').subscribe(res => (result = res));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === 'carts';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.getUrl).toHaveBeenCalledWith('carts', {
        userId,
      });
      mockReq.flush({ carts: [cartData] });
      expect(result).toEqual(cartData);
    });
  });

  describe('create a cart', () => {
    it('should able to create a new cart for the given user ', () => {
      let result;
      service.create(userId).subscribe(res => (result = res));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'POST' && req.url === 'createCart';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.getUrl).toHaveBeenCalledWith(
        'createCart',
        { userId },
        {}
      );
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });
  });

  describe('merge a cart', () => {
    it('should able to merge a cart to current one for the given user ', () => {
      let result;
      service
        .create(userId, cartId, toMergeCart.guid)
        .subscribe(res => (result = res));

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'POST' && req.url === 'createCart';
      });

      expect(occEndpointService.getUrl).toHaveBeenCalledWith(
        'createCart',
        { userId },
        { oldCartId: cartId, toMergeCartGuid: toMergeCart.guid }
      );

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mergedCart);
      expect(result).toEqual(mergedCart);
    });
  });
});
