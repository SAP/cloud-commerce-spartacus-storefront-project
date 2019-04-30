import { inject, TestBed } from '@angular/core/testing';

import { OccConfig } from '../../../occ/config/occ-config';
import { ImageType, Product } from '../../../occ/occ-models/occ.models';

import { ProductImageNormalizer } from './product-image-normalizer';
import { UIProduct } from '@spartacus/core';

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },
};

describe('ProductImageConverterService', () => {
  let service: ProductImageNormalizer;

  const product: Product = {
    code: 'testCode',
    description: 'test',
    images: [
      {
        altText: 'Test alt text',
        format: 'product',
        imageType: ImageType.PRIMARY,
        url: '/test1',
      },
      {
        altText: 'Test alt text',
        format: 'thumbnail',
        imageType: ImageType.PRIMARY,
        url: '/test2',
      },
      {
        altText: 'Test alt text',
        format: 'product',
        galleryIndex: 0,
        imageType: ImageType.GALLERY,
        url: '/test3',
      },
      {
        altText: 'Test alt text',
        format: 'thumbnail',
        galleryIndex: 0,
        imageType: ImageType.GALLERY,
        url: '/test4',
      },
    ],
  };

  const convertedProduct: UIProduct = {
    code: 'testCode',
    description: 'test',
    images: {
      PRIMARY: {
        product: {
          altText: 'Test alt text',
          format: 'product',
          imageType: ImageType.PRIMARY,
          url: '/test1',
        },
        thumbnail: {
          altText: 'Test alt text',
          format: 'thumbnail',
          imageType: ImageType.PRIMARY,
          url: '/test2',
        },
      },
      GALLERY: [
        {
          product: {
            altText: 'Test alt text',
            format: 'product',
            galleryIndex: 0,
            imageType: ImageType.GALLERY,
            url: '/test3',
          },
          thumbnail: {
            altText: 'Test alt text',
            format: 'thumbnail',
            galleryIndex: 0,
            imageType: ImageType.GALLERY,
            url: '/test4',
          },
        },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductImageNormalizer,
        { provide: OccConfig, useValue: MockOccModuleConfig },
      ],
    });

    service = TestBed.get(ProductImageNormalizer);
  });

  it('should inject ProductImageConverterService', inject(
    [ProductImageNormalizer],
    (productImageConverterService: ProductImageNormalizer) => {
      expect(productImageConverterService).toBeTruthy();
    }
  ));

  it('should convert product image', () => {
    const result = service.convert(product);
    expect(result).toEqual(convertedProduct);
  });
});
