import { reply } from '../../../chatbots/telegram/utils';
import MockBotTelegram from '../../__mocks__/chatbots/telegram.mock';
import {
  TelegramTestCase, ButtonContainerType,
} from '../../../chatbots/models';
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
    {
      name: 'With 4 buttons',
      message: 'Random Message 3',
      context: {
        text: 'asd asd asd asd',
        chatId: 2,
        options: {
          buttons: [
            {
              buttons: [
                {
                  text: 'text1',
                  action: 'action1',
                },
                {
                  text: 'text2',
                  action: 'action2',
                },
                {
                  text: 'text3',
                  action: 'action3',
                },
                {
                  text: 'text4',
                  action: 'action4',
                },
              ],
              buttonPerRow: 3,
              placeholder: 'placeholder',
              type: ButtonContainerType.SingleButton,
            },
          ],
        },
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
        message: 'Random Message 3',
        options: {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {
                  text: 'text1',
                  callback_data: 'action1',
                },
                {
                  text: 'text2',
                  callback_data: 'action2',
                },
                {
                  text: 'text3',
                  callback_data: 'action3',
                },
              ],
              [
                {
                  text: 'text4',
                  callback_data: 'action4',
                },
              ],
            ],
          }),
        },
      },
    },
    {
      name: 'With 0 buttons',
      message: 'Random Message 4',
      context: {
        text: 'asd asd asd asd',
        chatId: 2,
        options: {
          buttons: [
            {
              buttons: [],
              buttonPerRow: 3,
              placeholder: 'placeholder',
              type: ButtonContainerType.SingleButton,
            },
          ],
        },
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
        message: 'Random Message 4',
        options: {
          reply_markup: JSON.stringify({ inline_keyboard: [] }),
        },
      },
    },
    {
      name: 'With 1 button',
      message: 'Random Message 5',
      context: {
        text: 'asd asd asd asd',
        chatId: 2,
        options: {
          buttons: [
            {
              buttons: [{
                text: 'text1',
                action: 'action1',
              }],
              buttonPerRow: 3,
              placeholder: 'placeholder',
              type: ButtonContainerType.SingleButton,
            },
          ],
        },
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
        message: 'Random Message 5',
        options: {
          reply_markup: JSON.stringify({
            inline_keyboard: [[{
              text: 'text1',
              callback_data: 'action1',
            }]],
          }),
        },
      },
    },
    {
      name: 'With 1 button',
      message: 'Random Message 5',
      context: {
        text: 'asd asd asd asd',
        chatId: 2,
        options: {
          buttons: [
            {
              buttons: [
                {
                  text: 'text1',
                  action: 'action1',
                },
                {
                  text: 'text2',
                  action: 'action2',
                },
                {
                  text: 'text3',
                  action: 'action3',
                },
                {
                  text: 'text4',
                  action: 'action4',
                },
                {
                  text: 'text5',
                  action: 'action5',
                },
              ],
              buttonPerRow: 2,
              placeholder: 'placeholder',
              type: ButtonContainerType.SingleButton,
            },
          ],
        },
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
        message: 'Random Message 5',
        options: {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {
                  text: 'text1',
                  callback_data: 'action1',
                },
                {
                  text: 'text2',
                  callback_data: 'action2',
                },
              ],
              [
                {
                  text: 'text3',
                  callback_data: 'action3',
                },
                {
                  text: 'text4',
                  callback_data: 'action4',
                },
              ],
              [
                {
                  text: 'text5',
                  callback_data: 'action5',
                },
              ],
            ],
          }),
        },
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
      expect(bot.options.reply_markup).toStrictEqual(options.reply_markup);

      bot.nullify();
    });
  });
});
