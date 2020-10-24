// Change bold, italic and code from HTML to Markdown
const formatMessage = (message) => (message
  .replace(/<b>|<\/b>/g, '**')
  .replace(/<i>|<\/i>/g, '*')
  .replace(/<code>|<\/code>/g, '`')
);

const reply = (message, context) => {
  // Get channel from context
  const { channel, photoUrl } = context;

  // Format message to Markdown style, requested by Discord
  const formattedMessage = formatMessage(message);

  // Send message back to channel
  return new Promise((resolve, reject) => {
    if (channel) {
      if (photoUrl) channel.send(formattedMessage, { files: [photoUrl] });
      else channel.send(formattedMessage);
      resolve('Success');
    } else {
      reject(Error('Channel is not provided in context'));
    }
  });
};

module.exports = { reply };
