export class ProviderMessages {
  static discordBotIsConnected = '>>> Discord BOT is connected!';

  static discordBotIsRunning = '>>> Discord BOT is running!';

  static telegramBotIsConnected = '>>> Telegram BOT is connected!';

  static telegramBotIsRunning = '>>> Telegram BOT is running!';

  static slackBotIsConnected = '>>> Slack BOT is connected!';

  static slackBotIsRunning = '>>> Slack BOT is running!';

  static isConnectingTo(providerName: string): string {
    return `>>> Connecting to ${providerName}`;
  }
}
