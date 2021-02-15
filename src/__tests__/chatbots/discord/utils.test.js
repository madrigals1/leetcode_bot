import { formatMessage, reply } from '../../../chatbots/discord/utils';
import { isPromise } from '../../../utils/helper';
import MockFuncDiscord from '../../__mocks__/chatbots.mock';

const mockFuncDiscord = new MockFuncDiscord();

test('chatbots.discord.utils.formatMessage function', async () => {
  const testCases = [
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
  const testCases = [
    {
      message: '<b>Message 1</b>',
      context: {
        channel: { send: MockFuncDiscord.send }, photoUrl: 'random_url',
      },
      expected: 'Success',
      expectedMessage: '**Message 1**',
      expectedOptions: { files: ['random_url'] },
    },
    {
      message: '<i>Message 2</i>',
      context: { channel: { send: MockFuncDiscord.send } },
      expected: 'Success',
      expectedMessage: '**Message 2**',
      expectedOptions: {},
    },
    {
      message: '<i>Message 3</i>',
      context: { photoUrl: 'random_url_3' },
      expected: Error('Channel is not provided in context'),
      expectedMessage: null,
      expectedOptions: {},
    },
  ];

  testCases.forEach(async ({
    message, context, expected, expectedMessage, expectedOptions,
  }) => {
    const promise = reply(message, context);
    expect(isPromise(promise)).toBe(true);

    const result = await promise;

    expect(result).toBe(expected);
    expect(expectedMessage).toBe(mockFuncDiscord.message);
    expect(expectedOptions).toBe(mockFuncDiscord.expectedOptions);

    mockFuncDiscord.send(null);
  });
});
