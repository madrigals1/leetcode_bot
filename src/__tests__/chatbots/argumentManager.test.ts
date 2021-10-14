import ArgumentManager from '../../chatbots/argumentManager';
import { ParsedArgument } from '../../chatbots/decorators/models';
import { randomNumber, randomString } from '../__mocks__/randomUtils.test';

function generateArgument(): ParsedArgument {
  return {
    key: randomString(),
    index: randomNumber(),
    name: randomString(),
    value: randomString(),
  };
}

function addArgument(
  argumentManager: ArgumentManager, argument: ParsedArgument,
): void {
  argumentManager.keyMap.set(argument.key, argument);
  argumentManager.indexMap.set(argument.index, argument);
}

test('chatbots.argumentManager init', async () => {
  const argumentManager = new ArgumentManager();

  expect(argumentManager.getAll()).toEqual([]);
  expect(argumentManager.indexMap.size).toEqual(0);
  expect(argumentManager.keyMap.size).toEqual(0);
});

test('chatbots.argumentManager.get', async () => {
  const argumentManager = new ArgumentManager();

  // Should have no elements
  expect(argumentManager.get('wrong_key')).toBe(undefined);
  expect(argumentManager.get(3)).toBe(undefined);

  // Create single argument
  const argument = generateArgument();
  addArgument(argumentManager, argument);

  // Get by key and index
  expect(argumentManager.get(argument.key)).toEqual(argument);
  expect(argumentManager.get(argument.index)).toEqual(argument);

  // Create multiple arguments
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => {
    addArgument(argumentManager, arg);
  });

  // Get by key and index
  args.forEach((arg: ParsedArgument) => {
    expect(argumentManager.get(arg.index)).toEqual(arg);
    expect(argumentManager.get(arg.key)).toEqual(arg);
  });
});
