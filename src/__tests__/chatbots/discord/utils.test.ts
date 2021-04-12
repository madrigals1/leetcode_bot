import { formatMessage, reply } from '../../../chatbots/discord/utils';
import { isPromise } from '../../../utils/helper';
import MockFuncDiscord from '../../__mocks__/chatbots/discord.mock';
import { DiscordTestCase } from '../../../chatbots/models';

const mockFuncDiscord: MockFuncDiscord = new MockFuncDiscord();

test('chatbots.discord.utils.formatMessage function', async () => {
  const testCases: string[][] = [
    ['<b>Bold Text</b>', '**Bold Text**'],
    ['<i>Italic Text</i>', '*Italic Text*'],
    ['<code>Code Text</code>', '`Code Text`'],
    [
      'Hello <b><i><code>Human</code></i></b>, how <code>was <b>your <i>day</'
      + 'i></b></code>',
      'Hello ***`Human`***, how `was **your *day***`',
    ],
  ];

  testCases.forEach(([input, output]) => {
    expect(formatMessage(input)).toBe(output);
  });
});

test('chatbots.discord.utils.reply function', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testCases: DiscordTestCase[] = [
    {
      message: '<b>Message 1</b>',
      context: {
        channel: {
          send: mockFuncDiscord.send,
        },
        photoUrl: 'random_url',
        args: ['asd', 'asd', 'asd'],
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        prefix: '!',
      },
      expected: 'Success',
      expectedMessage: '**Message 1**',
      expectedOptions: { files: ['random_url'] },
    },
    {
      message: '<i>Message 2</i>',
      context: {
        channel: {
          send: mockFuncDiscord.send,
        },
        args: ['asd', 'asd', 'asd'],
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        prefix: '!',
      },
      expected: 'Success',
      expectedMessage: '**Message 2**',
      expectedOptions: {},
    },
    {
      message: '<i>Message 3</i>',
      context: {
        photoUrl: 'random_url_3',
        args: ['asd', 'asd', 'asd'],
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        prefix: '!',
      },
      expected: Error('Channel is not provided in context'),
      expectedMessage: null,
      expectedOptions: {},
    },
  ];

  testCases.forEach(async ({
    message, context, expected, expectedMessage, expectedOptions,
  }) => {
    const result: string = await reply(message, context);

    expect(result).toBe(expected);
    expect(expectedMessage).toBe(mockFuncDiscord.formattedMessage);
    expect(expectedOptions).toBe(mockFuncDiscord.options);
  });
});
