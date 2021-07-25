import { getArgs, isValidArgsCount } from '../../../chatbots/decorators/utils';
import { Args } from '../../../chatbots/models';

test('chatbots.decorators.utils.getArgs function', async () => {
  const testCases: Args[] = [
    {
      message: '/action Random action with Args',
      expectedArgs: ['Random', 'action', 'with', 'Args'],
    },
    {
      message: '!action wow here',
      expectedArgs: ['wow', 'here'],
    },
    {
      message: 'any words with separator',
      expectedArgs: ['words', 'with', 'separator'],
    },
  ];

  testCases.forEach(({ message, expectedArgs }) => {
    const args: string[] = getArgs(message);
    expect(args).toStrictEqual(expectedArgs);
  });
});

test('chatbots.decorators.utils.isValidArgsCount function', async () => {
  const testCases = [
    {
      input: {
        args: [],
        argsCount: [0],
      },
      output: true,
    },
    {
      input: {
        args: ['asd'],
        argsCount: [0, 1],
      },
      output: true,
    },
    {
      input: {
        args: [],
        argsCount: [0, 1],
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd'],
        argsCount: [0, 1],
      },
      output: false,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: [3],
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd', 'asd'],
        argsCount: [3],
      },
      output: false,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: [0, 1],
      },
      output: false,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: '+',
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd', 'asd', 'asd', 'asd', 'asd'],
        argsCount: '+',
      },
      output: true,
    },
    {
      input: {
        args: [],
        argsCount: '+',
      },
      output: false,
    },
    {
      input: {
        args: [],
        argsCount: '?',
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: '?',
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: '?',
      },
      output: true,
    },
    {
      input: {
        args: ['asd', 'asd', 'asd'],
        argsCount: 'X',
      },
      output: Error('Invalid argument argsCount: X'),
    },
  ];

  testCases.forEach(({ input, output }) => {
    const { args, argsCount } = input;
    if (typeof output === 'boolean') {
      expect(isValidArgsCount(args, argsCount)).toStrictEqual(output);
    } else {
      expect(() => isValidArgsCount(args, argsCount)).toThrowError(output);
    }
  });
});
