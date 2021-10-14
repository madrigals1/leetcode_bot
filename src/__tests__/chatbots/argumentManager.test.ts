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
  args.forEach((arg: ParsedArgument) => addArgument(argumentManager, arg));

  // Get by key and index
  args.forEach((arg: ParsedArgument) => {
    expect(argumentManager.get(arg.index)).toEqual(arg);
    expect(argumentManager.get(arg.key)).toEqual(arg);
  });
});

test('chatbots.argumentManager.pop', async () => {
  const argumentManager = new ArgumentManager();

  // Shouldn't pop when no arguments are present
  expect(argumentManager.pop('wrong_key')).toBe(undefined);
  expect(argumentManager.pop(3)).toBe(undefined);

  // Create 3 random arguments
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => addArgument(argumentManager, arg));

  // Select random argument from 3
  const randomArgument = args[randomNumber(args.length)];

  // Pop first element
  expect(argumentManager.pop(randomArgument.key)).toEqual(randomArgument);

  // Should have 2 elements
  expect(argumentManager.keyMap.size).toBe(2);
  expect(argumentManager.indexMap.size).toBe(2);

  // Select random argument from 2
  const randomArgument2 = args[randomNumber(args.length)];

  // Pop first element
  expect(argumentManager.pop(randomArgument2.key)).toEqual(randomArgument2);

  // Should have 1 element
  expect(argumentManager.keyMap.size).toBe(1);
  expect(argumentManager.indexMap.size).toBe(1);
});

test('chatbots.argumentManager.getAll', async () => {
  const argumentManager = new ArgumentManager();

  // Shouldn't have any elements
  expect(argumentManager.getAll()).toEqual([]);

  // Create 3 random arguments
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => addArgument(argumentManager, arg));

  // Should have all 3 elements
  expect(argumentManager.getAll()).toEqual(args);

  // Select random argument from 3
  const randomArgument = args[randomNumber(args.length)];

  // Pop random element
  argumentManager.pop(randomArgument.key);

  // Should have 2 left
  expect(argumentManager.getAll().length).toEqual(2);

  const argsLeft = args.filter((arg) => arg.key !== randomArgument.key);

  // Should have correct args
  expect(argumentManager.getAll()).toEqual(argsLeft);
});

test('chatbots.argumentManager.clear', async () => {
  const argumentManager = new ArgumentManager();

  // Shouldn't have any elements
  expect(argumentManager.getAll()).toEqual([]);

  // Create 3 random arguments
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => addArgument(argumentManager, arg));

  // Should have all 3 elements
  expect(argumentManager.getAll().length).toEqual(3);

  // Clear all arguments
  argumentManager.clear();

  // Shoult have no more elements after clearing
  expect(argumentManager.getAll().length).toEqual(0);
});
