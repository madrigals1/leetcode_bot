import * as TelegramTester from 'telegram-test';

import Telegram from '../../../chatbots/telegram';

// Create and Run telegram bot
const telegramBot = new Telegram();
telegramBot.token = 'random_token';
telegramBot.run();

// Initialize test bot
const telegramTest = new TelegramTester(telegramBot.bot);

test('chatbots.telegram > /ping action', async () => {
  telegramTest.sendUpdate(1, '/ping')
    .then((data) => (expect(data.text).toBe('pong')));
});
