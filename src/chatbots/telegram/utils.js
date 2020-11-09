const reply = (message, context) => {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, options);
};

const getArgs = (message) => {
  // Get all args from message
  const args = message.split(' ');

  // Remove action name
  args.shift();

  return args;
};

module.exports = { getArgs, reply };
