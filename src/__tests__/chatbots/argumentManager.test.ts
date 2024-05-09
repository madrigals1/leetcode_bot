import ArgumentManager from '../../chatbots/argumentManager';
import { ParsedArgument } from '../../chatbots/decorators/models';
import { randomNumber, randomString } from '../__mocks__/randomUtils.mock';

function generateArgument(): ParsedArgument {
  return new ParsedArgument(
    randomNumber(), // index
    randomString(), // key
    randomString(), // name
    randomString(), // value
  );
}

function addArgument(
  argumentManager: ArgumentManager,
  argument: ParsedArgument,
): void {
  argumentManager.keyMap.set(argument.key, argument);
  argumentManager.indexMap.set(argument.index, argument);
}

test('chatbots.argumentManager - initialize', async () => {
  const argumentManager = new ArgumentManager();

  expect(argumentManager.getAll()).toEqual([]);
  expect(argumentManager.indexMap.size).toEqual(0);
  expect(argumentManager.keyMap.size).toEqual(0);
});

describe('chatbots.argumentManager - get method', () => {
  test('Correct case - 0 arguments', () => {
    const argumentManager = new ArgumentManager();

    // Should have no elements
    expect(argumentManager.get('wrong_key')).toBe(undefined);
    expect(argumentManager.get(3)).toBe(undefined);
  });

  test('Correct case - 1 argument', () => {
    const argumentManager = new ArgumentManager();

    // Create single argument
    const argument = generateArgument();
    addArgument(argumentManager, argument);

    // Get by key and index
    expect(argumentManager.get(argument.key)).toEqual(argument);
    expect(argumentManager.get(argument.index)).toEqual(argument);
  });

  test('Correct case - 3 arguments', () => {
    const argumentManager = new ArgumentManager();

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
});

describe('chatbots.argumentManager - pop method', () => {
  test('Correct case - 0 arguments', () => {
    const argumentManager = new ArgumentManager();

    // Shouldn't pop when no arguments are present
    expect(argumentManager.pop('wrong_key')).toBe(undefined);
    expect(argumentManager.pop(3)).toBe(undefined);
  });

  test('Correct case - Pop arguments 1 by 1', () => {
    const argumentManager = new ArgumentManager();

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

    const argsLeft = args.filter((arg) => arg.key !== randomArgument.key);

    // Should have 2 elements
    expect(argumentManager.keyMap.size).toBe(2);
    expect(argumentManager.indexMap.size).toBe(2);

    // Select random argument from 2
    const randomArgument2 = argsLeft[randomNumber(argsLeft.length)];

    // Pop first element
    expect(argumentManager.pop(randomArgument2.key)).toEqual(randomArgument2);

    // Should have 1 element
    expect(argumentManager.keyMap.size).toBe(1);
    expect(argumentManager.indexMap.size).toBe(1);
  });
});

describe('chatbots.argumentManager - getAll method', () => {
  test('Correct case - 0 elements', () => {
    const argumentManager = new ArgumentManager();

    // Shouldn't have any elements
    expect(argumentManager.getAll()).toEqual([]);
  });

  test('Correct case - Multiple elements', () => {
    const argumentManager = new ArgumentManager();

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
});

test('chatbots.argumentManager - clear method', async () => {
  const argumentManager = new ArgumentManager();

  expect(argumentManager.getAll().length).toEqual(0);

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

describe('chatbots.argumentManager - upsert method', () => {
  test('Correct case - 1 argument', () => {
    const argumentManager = new ArgumentManager();

    // Shouldn't have any elements
    expect(argumentManager.getAll().length).toEqual(0);

    // Create 1 random argument
    const randomArgument1 = generateArgument();

    // Should have 1 element after adding
    expect(argumentManager.upsert(randomArgument1).length).toEqual(1);
    expect(argumentManager.getAll().length).toEqual(1);

    // Should have the same argument by both key and index
    expect(argumentManager.get(randomArgument1.key)).toEqual(randomArgument1);
    expect(argumentManager.get(randomArgument1.index)).toEqual(randomArgument1);
  });

  test('Correct case - 3 arguments', () => {
    const argumentManager = new ArgumentManager();

    // Generate 3 more args
    const args = [
      generateArgument(),
      generateArgument(),
      generateArgument(),
    ];
    args.forEach((arg: ParsedArgument) => argumentManager.upsert(arg));

    expect(argumentManager.getAll().length).toEqual(3);
  });

  test('Correct case - Update argument', () => {
    const argumentManager = new ArgumentManager();

    // Create new argument
    const argument = new ParsedArgument(0, 'hello', 'Hello', 'world!');
    argumentManager.upsert(argument);

    // Argument should exist by both key and value
    expect(argumentManager.get(0)).toBe(argument);
    expect(argumentManager.get('hello')).toBe(argument);

    // Update argument
    const newArgument = new ParsedArgument(0, 'hello', 'Other', 'value');
    argumentManager.upsert(newArgument);

    // Argument should exist by both key and value
    expect(argumentManager.get(0)).toBe(newArgument);
    expect(argumentManager.get('hello')).toBe(newArgument);
  });
});

test('chatbots.argumentManager - remove method', async () => {
  const argumentManager = new ArgumentManager();

  // Should not remove non-existing arguments
  expect(argumentManager.remove(generateArgument())).toEqual([]);

  // Generate 3 args
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => argumentManager.upsert(arg));

  // Select random argument from 3
  const randomArgument1 = args[randomNumber(args.length)];

  argumentManager.remove(randomArgument1);
  expect(argumentManager.getAll().length).toEqual(2);

  const argsLeft = args.filter((arg) => arg.key !== randomArgument1.key);

  expect(argumentManager.getAll()).toEqual(argsLeft);
});

test('chatbots.argumentManager - count method', async () => {
  const argumentManager = new ArgumentManager();

  // Should not remove non-existing arguments
  expect(argumentManager.remove(generateArgument())).toEqual([]);

  // Argument amount should be 0
  expect(argumentManager.count).toBe(0);

  // Generate 3 args
  const args = [
    generateArgument(),
    generateArgument(),
    generateArgument(),
  ];
  args.forEach((arg: ParsedArgument) => argumentManager.upsert(arg));

  // Argument amount should be 3
  expect(argumentManager.count).toBe(3);

  // Remove one of the arguments
  argumentManager.remove(args[0]);

  // Argument amount should be 2
  expect(argumentManager.count).toEqual(2);
});
