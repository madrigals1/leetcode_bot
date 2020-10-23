const { replaceAll } = require('../../utils/helper');

const sendFormattedMessage = (message, context) => {
  // Get channel from context
  const { channel } = context;

  // Change bold, italic and code from HTML to Markdown
  let formatted = replaceAll(message, '<b>', '**');
  formatted = replaceAll(formatted, '</b>', '**');
  formatted = replaceAll(formatted, '<i>', '*');
  formatted = replaceAll(formatted, '</i>', '*');
  formatted = replaceAll(formatted, '<code>', '`');
  formatted = replaceAll(formatted, '</code>', '`');

  // Send message back to channel
  channel.send(formatted);
};

module.exports = { sendFormattedMessage };
