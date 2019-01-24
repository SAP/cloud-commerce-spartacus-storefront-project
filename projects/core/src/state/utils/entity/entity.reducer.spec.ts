import { entityReducer, initialEntityState } from './entity.reducer';
import { EntityAction } from './entity.action';

describe('Entity reducer', () => {
  const testSubReducer = jasmine
    .createSpy()
    .and.callFake((state = 'test', _action) => state);

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = entityReducer('testType', testSubReducer)(
        undefined,
        action
      );

      expect(state).toEqual(initialEntityState);
    });
  });

  describe('entity action', () => {
    it('should use targeted reducer', () => {
      const action = {
        meta: { entity: { id: 'testId', type: 'testType' } }
      } as EntityAction;
      const state = entityReducer('testType', testSubReducer)(
        undefined,
        action
      );
      const expectedState = {
        entities: {
          testId: 'test'
        }
      };

      expect(state).toEqual(expectedState);
      expect(testSubReducer).toHaveBeenCalledWith(undefined, action);
    });
  });
});
