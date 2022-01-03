import { reply } from '../../../chatbots/telegram/utils';
import MockBotTelegram from '../../__mocks__/chatbots/telegram.mock';
import { TelegramTestCase } from '../../../chatbots/models';
import {
  getPositionalParsedArguments,
} from '../../../chatbots/decorators/utils';

const bot = new MockBotTelegram();

test('chatbots.telegram.utils.reply function', async () => {
  const testCases: TelegramTestCase[] = [
    {
      message: 'Random Message 1',
      context: {
        text: 'asd asd asd',
        chatId: 1,
        options: {},
        bot,
        photoUrl: 'random_url',
        reply: () => new Promise(() => 'asd'),
        argumentParser: getPositionalParsedArguments,
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
        text: 'asd asd asd',
        chatId: 2,
        options: {},
        bot,
        photoUrl: null,
        reply: () => new Promise(() => 'asd'),
        argumentParser: getPositionalParsedArguments,
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
