import { Argument } from './argument';

describe('Argument class', () => {
  describe('constructor method', () => {
    function init() {
      return new Argument({
        index: 1, key: 'key', name: 'Name', value: 'placeholder',
      });
    }

    it('should have correct index', () => {
      const arg = init();

      expect(arg.index).toBe(1);
    });

    it('should have correct key', () => {
      const arg = init();

      expect(arg.key).toBe('key');
    });

    it('should have correct name', () => {
      const arg = init();

      expect(arg.name).toBe('Name');
    });
  });

  describe('values: ', () => {
    function initWithValue(value: string | string[]) {
      return new Argument({
        index: 1, key: 'placeholder', name: 'placeholder', value,
      });
    }

    describe('value property', () => {
      it('should return lowercased value for single string', () => {
        const arg = initWithValue('Value');

        expect(arg.value).toBe('value');
      });

      it('should return lowercased value for array of strings', () => {
        const arg = initWithValue(['Value', 'Another']);

        expect(arg.value).toBe('value another');
      });
    });

    describe('values property', () => {
      it('should return lowercased array of values for single string', () => {
        const arg = initWithValue('Value');

        expect(arg.values).toEqual(['value']);
      });

      it(
        'should return lowercased array of values for array of strings',
        () => {
          const arg = initWithValue(['Value', 'Another']);

          expect(arg.values).toEqual(['value', 'another']);
        },
      );
    });
  });
});
