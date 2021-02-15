import { reply, getArgs } from '../../../chatbots/telegram/utils';
import MockBotTelegram from '../../__mocks__/chatbots/telegram.mock';

const bot = new MockBotTelegram();

test('chatbots.telegram.utils.reply function', async () => {
  const testCases = [
    {
      message: 'Random Message 1',
      context: {
        chatId: 1,
        options: { unused: 'options' },
        bot,
        photoUrl: 'random_url',
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
        options: { used: 'options' },
        bot,
        photoUrl: null,
      },
      expected: {
        chatId: 2,
        photoUrl: null,
        message: 'Random Message 2',
        options: { used: 'options' },
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
