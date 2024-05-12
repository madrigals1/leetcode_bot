import { Status } from '../../models';

import ArgumentManager from './argumentManager';
import { Argument } from './models';

const ARGUMENT_1 = new Argument({
  key: 'key1', index: 1, name: 'placeholder', value: 'value1',
});
const ARGUMENT_2 = new Argument({
  key: 'key2', index: 2, name: 'placeholder', value: 'value2',
});

describe('ArgumentManager', () => {
  describe('with one argument', () => {
    function initWithOneArgument() {
      const argumentManager = new ArgumentManager();
      argumentManager.addOrUpdate(ARGUMENT_1);

      return argumentManager;
    }

    describe('by key', () => {
      it('should get created argument', () => {
        const argumentManager = initWithOneArgument();

        const response = argumentManager.get('key1');

        expect(response).toEqual({
          status: Status.SUCCESS,
          code: 200,
          message: 'Argument found',
          payload: ARGUMENT_1,
        });
      });

      it('should replace existing argument', () => {
        const argumentManager = initWithOneArgument();
        const updatedArgument = new Argument({
          key: 'key1', index: 2, name: 'placeholder', value: 'placeholder',
        });

        const response = argumentManager.addOrUpdate(updatedArgument);

        expect(response).toContainEqual({
          status: Status.SUCCESS,
          code: 200,
          message: 'Replaced existing argument with key: key1',
          payload: updatedArgument,
        });
        expect(argumentManager.count).toBe(1);
        expect(argumentManager.get('key1').payload?.index).toBe(2);
      });

      it('should remove an existing argument', () => {
        const argumentManager = initWithOneArgument();

        const response = argumentManager.remove('key1');

        expect(response).toEqual({
          status: Status.SUCCESS,
          code: 204,
          message: 'Argument succesfully removed',
        });
        expect(argumentManager.count).toBe(0);
        expect(argumentManager.get('key1').status).toBe(Status.FAILURE);
      });
    });

    describe('by index', () => {
      it('should get created argument', () => {
        const argumentManager = initWithOneArgument();

        const response = argumentManager.get(1);

        expect(response).toEqual({
          status: Status.SUCCESS,
          code: 200,
          message: 'Argument found',
          payload: ARGUMENT_1,
        });
      });

      it('should replace existing argument', () => {
        const argumentManager = initWithOneArgument();
        const updatedArgument = new Argument({
          key: 'key2', index: 1, name: 'placeholder', value: 'placeholder',
        });

        const response = argumentManager.addOrUpdate(updatedArgument);

        expect(response).toContainEqual({
          status: Status.SUCCESS,
          code: 200,
          message: 'Replaced existing argument with index: 1',
          payload: updatedArgument,
        });
        expect(argumentManager.count).toBe(1);
        expect(argumentManager.get(1).payload?.key).toBe('key2');
      });

      it('should remove an existing argument', () => {
        const argumentManager = initWithOneArgument();

        const response = argumentManager.remove(1);

        expect(response).toEqual({
          status: Status.SUCCESS,
          code: 204,
          message: 'Argument succesfully removed',
        });
        expect(argumentManager.count).toBe(0);
        expect(argumentManager.get('key1').status).toBe(Status.FAILURE);
      });
    });
  });

  describe('with multiple arguments', () => {
    function initWithMultipleArguments() {
      const argumentManager = new ArgumentManager();
      argumentManager.addOrUpdate(ARGUMENT_1);
      argumentManager.addOrUpdate(ARGUMENT_2);

      return argumentManager;
    }

    it('should return correct argument count', () => {
      const argumentManager = initWithMultipleArguments();

      expect(argumentManager.count).toBe(2);
    });

    it('should clear all arguments', () => {
      const argumentManager = initWithMultipleArguments();

      const response = argumentManager.clear();

      expect(response).toEqual({
        status: Status.SUCCESS,
        code: 204,
        message: 'All arguments are removed',
      });
      expect(argumentManager.count).toBe(0);
    });

    it('should return all arguments', () => {
      const argumentManager = initWithMultipleArguments();

      expect(argumentManager.getAll()).toEqual([ARGUMENT_1, ARGUMENT_2]);
    });
  });

  describe('with no arguments', () => {
    function init() {
      return new ArgumentManager();
    }

    it('should add an argument by both key and index', () => {
      const argumentManager = init();

      const response = argumentManager.addOrUpdate(ARGUMENT_1);

      expect(response).toEqual([{
        status: Status.SUCCESS,
        code: 201,
        message: 'Created new argument with key: key1',
        payload: ARGUMENT_1,
      }, {
        status: Status.SUCCESS,
        code: 201,
        message: 'Created new argument with index: 1',
        payload: ARGUMENT_1,
      }]);
      expect(argumentManager.count).toBe(1);
      expect(argumentManager.get('key1').payload?.index).toBe(1);
      expect(argumentManager.get(1).payload?.key).toBe('key1');
    });

    it('should return correct argument count', () => {
      const argumentManager = init();

      expect(argumentManager.count).toBe(0);
    });

    it('should return no argument', () => {
      const argumentManager = init();

      expect(argumentManager.getAll()).toEqual([]);
    });

    describe('by index', () => {
      it('should return 404 when getting argument', () => {
        const argumentManager = init();

        const response = argumentManager.get(1);

        expect(response).toEqual({
          status: Status.FAILURE,
          code: 404,
          message: 'Argument not found',
        });
      });

      it('should return 404 when removing argument', () => {
        const argumentManager = init();

        const response = argumentManager.remove(1);

        expect(response).toEqual({
          status: Status.FAILURE,
          code: 404,
          message: 'Argument not found',
        });
      });
    });

    describe('by key', () => {
      it('should return 404 when getting argument', () => {
        const argumentManager = init();

        const response = argumentManager.get('key1');

        expect(response).toEqual({
          status: Status.FAILURE,
          code: 404,
          message: 'Argument not found',
        });
      });

      it('should return 404 when removing argument', () => {
        const argumentManager = init();

        const response = argumentManager.remove('key1');

        expect(response).toEqual({
          status: Status.FAILURE,
          code: 404,
          message: 'Argument not found',
        });
      });
    });
  });
});
