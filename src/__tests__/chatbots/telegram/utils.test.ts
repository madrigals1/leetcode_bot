import { reply, getArgs } from '../../../chatbots/telegram/utils';
import MockBotTelegram from '../../__mocks__/chatbots/telegram.mock';
import { TelegramTestCase, Args } from '../models';

const bot = new MockBotTelegram();

test('chatbots.telegram.utils.reply function', async () => {
  const testCases: TelegramTestCase[] = [
    {
      message: 'Random Message 1',
      context: {
        chatId: 1,
        options: {},
        bot,
        photoUrl: 'random_url',
        args: ['asd', 'asd', 'asd'],
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        prefix: '!',
      },
      expected: {
        chatId: 1,
        photoUrl: 'random_url',
        message: null,
        options: { captions: 'Random Message 1' },
      },
    },
    {
      message: 'Random Message 2',
      context: {
        chatId: 2,
        options: {},
        bot,
        photoUrl: null,
        args: ['asd', 'asd', 'asd'],
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        prefix: '!',
      },
      expected: {
        chatId: 2,
        photoUrl: null,
        message: 'Random Message 2',
        options: {},
      },
    },
  ];

  testCases.forEach(({ message, context, expected }) => {
    reply(message, context);

    const {
      chatId,
      photoUrl,
      message: expectedMessage,
      options,
    } = expected;

    expect(bot.chatId).toBe(chatId);
    expect(bot.photoUrl).toBe(photoUrl);
    expect(bot.message).toBe(expectedMessage);
    expect(bot.options).toStrictEqual(options);

    bot.nullify();
  });
});

test('chatbots.telegram.utils.getArgs function', async () => {
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
