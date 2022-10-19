export enum ChatbotProvider {
  Telegram = '01_telegram',
  Discord = '02_discord',
  Slack = '03_slack',
  Mockbot = '04_mockbot',
  Random = '05_random',
}

export function getChatbotNameByKey(value: string): string {
  const indexOfS = Object.values(ChatbotProvider)
    .indexOf(value as unknown as ChatbotProvider);

  const key = Object.keys(ChatbotProvider)[indexOfS];

  return key;
}
