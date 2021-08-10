import { jest } from '@jest/globals';

import TelegramBotInstance from '../../../chatbots/telegram';
import constants from '../../../utils/constants';
import dictionary from '../../../utils/dictionary';

TelegramBotInstance.token = constants.PROVIDERS.TELEGRAM.TOKEN;

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

test('chatbots.telegram.index.run function', async () => {
  if (!constants.PROVIDERS.TELEGRAM.TEST_ENABLE) return;

  TelegramBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.TELEGRAM_BOT_IS_CONNECTED,
  );

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.TELEGRAM_BOT_IS_RUNNING,
  );
});
