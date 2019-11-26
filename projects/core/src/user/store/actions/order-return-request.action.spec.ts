import { ReturnRequestEntryInputList } from '../../../model/order.model';
import { UserActions } from './index';

const returnRequestInput: ReturnRequestEntryInputList = {
  returnRequestEntryInputs: [{ orderEntryNumber: 0, quantity: 1 }],
};

describe('Order Return RequestActions', () => {
  describe('CreateOrderReturnRequest Action', () => {
    it('should create the action', () => {
      const action = new UserActions.CreateOrderReturnRequest({
        userId: 'userId',
        returnRequestInput,
      });

      expect({ ...action }).toEqual({
        type: UserActions.CREATE_ORDER_RETURN_REQUEST,
        payload: {
          userId: 'userId',
          returnRequestInput,
        },
      });
    });
  });

  describe('CreateOrderReturnRequestFail Action', () => {
    it('should create the action', () => {
      const error = 'mockError';
      const action = new UserActions.CreateOrderReturnRequestFail(error);

      expect({ ...action }).toEqual({
        type: UserActions.CREATE_ORDER_RETURN_REQUEST_FAIL,
        payload: error,
      });
    });
  });

  describe('CreateOrderReturnRequestSuccess Action', () => {
    it('should create the action', () => {
      const action = new UserActions.CreateOrderReturnRequestSuccess({
        rma: '0000',
      });

      expect({ ...action }).toEqual({
        type: UserActions.CREATE_ORDER_RETURN_REQUEST_SUCCESS,
        payload: { rma: '0000' },
      });
    });
  });
});
