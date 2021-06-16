import { Context, SlackMessage } from '../models';

// Change bold, italic and code from HTML to Markdown
export function formatMessage(message: string): string {
  return message
    .replace(/<b>|<\/b>/g, '*')
    .replace(/<i>|<\/i>/g, '_')
    .replace(/<code>|<\/code>/g, '`');
}

export function reply(message: string, context: Context): Promise<string> {
  const { channel, photoUrl, args } = context;

  // Get Username from args
  const username = args[0];
  const userText = formatMessage(`User - *\`${username}\`*`);

  // Format message to Slack style
  const formattedMessage: string = formatMessage(message);

  // Send message back to channel
  return new Promise((resolve, reject) => {
    if (!channel) {
      reject(Error('Channel is not provided in context'));
    }

    const processedMessage: SlackMessage = !photoUrl
      ? { text: formattedMessage }
      : {
        text: userText,
        attachments: [
          {
            fallback: userText,
            image_url: photoUrl,
          },
        ],
      };

    channel.send(processedMessage);
    resolve('Success');
  });
}

export function getArgs(message: string): string[] {
  if (message === '') return [];

  return message.split(' ');
}
