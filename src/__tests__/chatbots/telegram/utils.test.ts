import { reply } from '../../../chatbots/telegram/utils';
import MockBotTelegram from '../../__mocks__/chatbots/telegram.mock';
import { TelegramTestCase } from '../../../chatbots/models';
import {
  getPositionalParsedArguments,
} from '../../../chatbots/decorators/utils';
import { ChatbotProvider } from '../../../chatbots';

const bot = new MockBotTelegram();

describe('chatbots.telegram.utils - reply function', () => {
  const testCases: TelegramTestCase[] = [
    {
      name: 'With photo URL',
      message: 'Random Message 1',
      context: {
        text: 'asd asd asd',
        chatId: 1,
        options: {},
        bot,
        photoUrl: 'random_url',
        reply: () => new Promise(() => 'asd'),
        argumentParser: getPositionalParsedArguments,
        provider: ChatbotProvider.Random,
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
      name: 'Without photo URL',
      message: 'Random Message 2',
      context: {
        text: 'asd asd asd',
        chatId: 2,
        options: {},
        bot,
        photoUrl: null,
        reply: () => new Promise(() => 'asd'),
        argumentParser: getPositionalParsedArguments,
        provider: ChatbotProvider.Random,
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

  testCases.forEach(({
    name, message, context, expected,
  }) => {
    test(name, async () => {
      await reply(message, context);

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
});
