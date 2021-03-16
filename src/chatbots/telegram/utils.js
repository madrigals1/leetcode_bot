export const reply = (message, context) => {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, options);
};

export const getArgs = (message) => {
  // Get all args from message
  const args = message.split(' ');

  // Remove action name
  args.shift();

  return args;
};
