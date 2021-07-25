import { getArgs } from '../../../chatbots/decorators/utils';
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
