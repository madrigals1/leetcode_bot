import { ParsedArgument } from '../../../chatbots/decorators/models';

describe('chatbots.decorators.models - ParsedArgument class', () => {
  test('constructor method', () => {
    const index = 123;
    const key = 'key_123';
    const name = 'argument123';
    const value = 'xyz';

    const instance = new ParsedArgument(index, key, name, value);

    expect(instance.index).toBe(index);
    expect(instance.key).toBe(key);
    expect(instance.name).toBe(name);
  });

  test('value method', () => {
    const value1 = 'value456';
    const instance1 = new ParsedArgument(456, 'key_456', 'argument456', value1);

    expect(instance1.value).toBe(value1);

    const value2 = ['value1', 'value2', 'value3'];
    const instance2 = new ParsedArgument(456, 'key_456', 'argument456', value2);

    expect(instance2.value).toBe('value1 value2 value3');
  });

  test('values method', () => {
    const value1 = 'value789';
    const instance1 = new ParsedArgument(789, 'key_789', 'argument789', value1);

    expect(instance1.values).toStrictEqual([value1]);

    const value2 = ['value1', 'value2', 'value3'];
    const instance2 = new ParsedArgument(789, 'key_789', 'argument789', value2);

    expect(instance2.values).toStrictEqual(value2);
  });
});
