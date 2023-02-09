import { Client as DiscordClient } from 'discord.js';
import * as TelegramBot from 'node-telegram-bot-api';

import { reply } from '../../../chatbots/telegram/utils';
import {
  getPositionalParsedArguments,
} from '../../../chatbots/decorators/utils';
import { ChatbotProvider } from '../../../chatbots';
import {
  SERVER_MESSAGES as SM, BOT_MESSAGES as BM,
} from '../../../utils/dictionary';
import {
  ButtonContainer,
  ButtonContainerType,
  Options,
} from '../../../chatbots/models';

jest.mock('node-telegram-bot-api');

describe.only('chatbots.telegram.utils - reply function', () => {
  const _bot = new TelegramBot('', {});

  async function testReply({
    message = 'placeholder',
    photoUrl,
    next = 'placeholder',
    chatId = 1,
    options = {},
    bot = _bot,
    errorOnSendMessage = undefined,
    errorOnSendPhoto = undefined,
  } : {
    message?: string;
    photoUrl?: string;
    next?: string;
    chatId?: number;
    options?: Options;
    bot?: DiscordClient | TelegramBot;
    errorOnSendMessage?: string;
    errorOnSendPhoto?: string;
  } = {}) {
    let sendMessageSpy;
    let sendPhotoSpy;

    if (errorOnSendMessage) {
      sendMessageSpy = jest
        .spyOn(TelegramBot.prototype, 'sendMessage')
        .mockRejectedValue(new Error(errorOnSendMessage));
    } else {
      sendMessageSpy = jest
        .spyOn(TelegramBot.prototype, 'sendMessage')
        .mockReturnValue(Promise.resolve({
          message_id: 1,
          date: 123123,
          chat: {
            id: chatId,
            type: 'private',
          },
          next,
        }));
    }

    if (errorOnSendPhoto) {
      sendPhotoSpy = jest
        .spyOn(TelegramBot.prototype, 'sendMessage')
        .mockRejectedValue(new Error(errorOnSendPhoto));
    } else {
      sendPhotoSpy = jest
        .spyOn(TelegramBot.prototype, 'sendPhoto')
        .mockReturnValue(Promise.resolve({
          message_id: 1,
          date: 123123,
          chat: {
            id: chatId,
            type: 'private',
          },
          next,
        }));
    }

    const response = await reply(message, {
      text: 'placeholder',
      chatId,
      bot,
      photoUrl,
      options,
      reply: () => Promise.resolve('asd'),
      argumentParser: getPositionalParsedArguments,
      provider: ChatbotProvider.Telegram,
      prefix: '!',
    });

    return { response, sendMessageSpy, sendPhotoSpy };
  }

  it('with photo URL', async () => {
    const { sendPhotoSpy } = await testReply({
      message: 'Random Message 1',
      chatId: 1,
      photoUrl: 'random_url',
    });

    expect(sendPhotoSpy)
      .toHaveBeenCalledWith(1, 'random_url', { caption: 'Random Message 1' });
  });

  it('without photo URL', async () => {
    const { sendMessageSpy } = await testReply({
      message: 'Random Message 2',
      chatId: 2,
    });

    expect(sendMessageSpy)
      .toHaveBeenCalledWith(2, 'Random Message 2', {});
  });

  describe('with buttons', () => {
    async function testReplyWithButtons(buttons?: ButtonContainer[]) {
      return testReply({ options: { buttons } });
    }

    it('with 0 buttons', async () => {
      const { sendMessageSpy } = await testReplyWithButtons([
        {
          buttons: [],
          buttonPerRow: 3,
          placeholder: 'placeholder',
          type: ButtonContainerType.SingleButton,
        },
      ]);

      expect(sendMessageSpy)
        .toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          {
            reply_markup: { inline_keyboard: [] },
          },
        );
    });

    it('with 1 button', async () => {
      const { sendMessageSpy } = await testReplyWithButtons([
        {
          buttons: [{
            text: 'text1',
            action: 'action1',
          }],
          buttonPerRow: 3,
          placeholder: 'placeholder',
          type: ButtonContainerType.SingleButton,
        },
      ]);

      expect(sendMessageSpy)
        .toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          {
            reply_markup: {
              inline_keyboard: [[{
                text: 'text1',
                callback_data: 'action1',
              }]],
            },
          },
        );
    });

    it('with 4 buttons, 3 per row', async () => {
      const { sendMessageSpy } = await testReplyWithButtons([
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
      ]);

      expect(sendMessageSpy)
        .toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          {
            reply_markup: {
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
            },
          },
        );
    });

    it('with 5 buttons, 2 per row', async () => {
      const { sendMessageSpy } = await testReplyWithButtons([
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
      ]);

      expect(sendMessageSpy)
        .toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          {
            reply_markup: {
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
            },
          },
        );
    });
  });

  it('Incorrect bot type', async () => {
    const { response } = await testReply({
      bot: new DiscordClient({ intents: [] }),
    });

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(SM.INCORRECT_BOT_TYPE);
    expect(response).toBe(BM.ERROR_ON_THE_SERVER);
  });

  it('Error on sendMessage', async () => {
    const { response } = await testReply({
      errorOnSendMessage: 'fake error message 1',
    });

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(new Error('fake error message 1'));
    expect(response).toBe(BM.ERROR_ON_THE_SERVER);
  });

  it('Error on sendPhoto', async () => {
    const { response } = await testReply({
      errorOnSendPhoto: 'fake error message 2',
    });

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(new Error('fake error message 2'));
    expect(response).toBe(BM.ERROR_ON_THE_SERVER);
  });
});
