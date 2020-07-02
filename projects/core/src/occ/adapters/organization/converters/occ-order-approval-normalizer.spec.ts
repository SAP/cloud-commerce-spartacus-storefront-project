import { Type } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ORDER_NORMALIZER } from 'projects/core/src/checkout/connectors/checkout/converters';
import { ConverterService } from 'projects/core/src/util/converter.service';
import { OrderApproval } from '../../../../model/order-approval.model';
import { OccConfig } from '../../../config/occ-config';
import { Occ } from '../../../occ-models/occ.models';
import { OccOrderApprovalNormalizer } from './occ-order-approval-normalizer';

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },
};

const occOrderApprovalNoOrder: Occ.OrderApproval = {
  code: 'testCode',
};

const convertedOrderApprovalNoOrder: OrderApproval = {
  code: 'testCode',
};

const occOrderApproval: Occ.OrderApproval = {
  code: 'testCode',
  order: {
    code: 'orderCode',
  },
};

const convertedOrderApproval: OrderApproval = {
  code: 'testCode',
  order: {
    code: 'orderCode-converted',
  },
};

fdescribe('OrderApprovalNormalizer', () => {
  let service: OccOrderApprovalNormalizer;
  let converter: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccOrderApprovalNormalizer,
        { provide: OccConfig, useValue: MockOccModuleConfig },
      ],
    });

    service = TestBed.inject(
      OccOrderApprovalNormalizer as Type<OccOrderApprovalNormalizer>
    );
    converter = TestBed.inject(ConverterService);
    spyOn(converter, 'convert').and.callFake(
      (order) =>
        ({
          ...order,
          code: (order as Occ.Order).code + '-converted',
        } as any)
    );
  });

  it('should inject OccOrderApprovalNormalizer', inject(
    [OccOrderApprovalNormalizer],
    (costCenterNormalizer: OccOrderApprovalNormalizer) => {
      expect(costCenterNormalizer).toBeTruthy();
    }
  ));

  it('should convert occOrderApproval with no order', () => {
    const result = service.convert(occOrderApprovalNoOrder);
    expect(result).toEqual(convertedOrderApprovalNoOrder);
    expect(converter.convert).not.toHaveBeenCalled();
  });

  it('should convert occOrderApproval with order data', () => {
    const result = service.convert(occOrderApproval);
    expect(result).toEqual(convertedOrderApproval);
    expect(converter.convert).toHaveBeenCalledWith(
      occOrderApproval.order,
      ORDER_NORMALIZER
    );
  });

  it('should convert occOrderApproval with applied target', () => {
    const result = service.convert(occOrderApproval, {});
    expect(result).toEqual({});
  });
});
