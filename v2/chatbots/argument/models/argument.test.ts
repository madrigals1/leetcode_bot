import { Argument } from './argument';

describe('Argument class', () => {
  describe('constructor method', () => {
    function initClass() {
      return new Argument(1, 'key', 'Name', 'placeholder');
    }

    it('should have correct index', () => {
      const arg = initClass();

      expect(arg.index).toBe(1);
    });

    it('should have correct key', () => {
      const arg = initClass();

      expect(arg.key).toBe('key');
    });

    it('should have correct name', () => {
      const arg = initClass();

      expect(arg.name).toBe('Name');
    });
  });

  describe('values: ', () => {
    describe('value property', () => {
      it('should return lowercased value for single string', () => {
        const arg = new Argument(1, 'placeholder', 'placeholder', 'Value');

        expect(arg.value).toBe('value');
      });

      it('should return lowercased value for array of strings', () => {
        const arg = new Argument(
          1,
          'placeholder',
          'placeholder',
          ['Value', 'Another'],
        );

        expect(arg.value).toBe('value another');
      });
    });

    describe('values property', () => {
      it('should return lowercased array of values for single string', () => {
        const arg = new Argument(1, 'placeholder', 'placeholder', 'Value');

        expect(arg.values).toEqual(['value']);
      });

      it(
        'should return lowercased array of values for array of strings',
        () => {
          const arg = new Argument(
            1,
            'placeholder',
            'placeholder',
            ['Value', 'Another'],
          );

          expect(arg.values).toEqual(['value', 'another']);
        },
      );
    });
  });
});
