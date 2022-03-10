import { Context } from '../models';
import { ButtonContainer } from '../models/buttons.model';

function getReplyMarkupFromButtons(
  buttonContainers: ButtonContainer[],
): string {
  const keyboard = [];

  buttonContainers?.forEach((buttonContainer) => {
    const { buttons, buttonPerRow } = buttonContainer;

    for (let i = 0; i < Math.ceil(buttons.length / buttonPerRow); i++) {
      const row = [];

      for (let j = 0; j < buttonPerRow; j++) {
        const index = (i * buttonPerRow) + j;

        if (index < buttons.length) {
          const button = buttons[index];
          row.push({ text: button.text, callback_data: button.action });
        }
      }

      keyboard.push(row);
    }
  });

  return JSON.stringify({ inline_keyboard: keyboard });
}

export function reply(message: string, context: Context): Promise<string> {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  const replyMarkupOptions = options.buttons
    ? { reply_markup: getReplyMarkupFromButtons(options.buttons) }
    : {};

  // Update options with Telegram specific data
  const updatedOptions = { ...options, ...replyMarkupOptions };

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, updatedOptions);
}
